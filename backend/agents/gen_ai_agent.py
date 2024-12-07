# -*- coding: utf-8 -*-
"""langgraph_bmw.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1gOBiTaIac1-VAe3uVbqFiReExaAr9EsF
"""

# Commented out IPython magic to ensure Python compatibility.
# %%capture --no-stderr
# %pip install --quiet -U langgraph langchain-community langchain-openai tavily-python langchain_core
# %pip install langchain-experimental

# Commented out IPython magic to ensure Python compatibility.
# %pip install langchain_core
import logging
import asyncio
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
import sys
sys.path.append("../")
import os
import getpass
from uuid import uuid4
from langchain_experimental.utilities import PythonREPL
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import Tool, create_json_chat_agent, AgentExecutor
#from spikes_utils import CustomLLM

# Import all necessary modules at the top of the file
from langchain_core.language_models.llms import LLM
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.output_parsers import PydanticOutputParser, JsonOutputParser
from langchain_core.runnables import Runnable, RunnablePassthrough, RunnableMap
from langchain_core.utils.function_calling import convert_to_openai_tool
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from typing import Any, List, Mapping, Optional, Union, Literal, Dict, ClassVar
import websocket
import json
from contextlib import closing
from operator import itemgetter

API_TOKEN='dMvnprwPut19y3tLrCJyu7LOUdhkvQJN6ZJaFehO'
import re
from operator import itemgetter
from typing import Optional, Union, Dict, Any, Literal
from pydantic import BaseModel
import re

def extract_json(text: str) -> str:
        """Extract JSON object from text using regex."""
        json_pattern = r'\{(?:[^{}]|(?R))*\}'  # Recursive pattern to match nested braces
        match = re.search(json_pattern, text)
        if match:
            return match.group(0)
        return text 

def json_extractor(output):
        """Wrapper function to extract JSON from model output."""
        if isinstance(output, str):
            return extract_json(output)
        return output
        
class CustomLLM(LLM):
    model_name: str
    session_id: str
    SOCKET_URL: str
    API_TOKEN: str
    temperature: float
    maxTokens: int = 512
    stop_word: Optional[str] = None

    # Example of a class variable that should be ignored by Pydantic
    some_class_var: ClassVar[Any] = "Some Value"

    @property
    def _llm_type(self) -> str:
        return "custom"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:

        def send_query(ws, prompt):
            model_interface = 'multimodal' if self.model_name.startswith('anthropic.claude-3') else 'langchain'
            provider = (
                            'liquidai' if self.model_name.startswith('liquid') 
                            else 'azure' if self.model_name.startswith('openai') 
                            else 'bedrock'
                        )
            data = {
                "action": "run",
                "modelInterface": model_interface,
                "data": {
                    "mode": "chain",
                    "text": prompt,
                    "files": [],
                    "modelName": self.model_name,
                    "provider": provider,
                    "sessionId": self.session_id,
                    "workspaceId": "",
                    "modelKwargs": {
                        "streaming": False,
                        "maxTokens": self.maxTokens,
                        "temperature": self.temperature,
                        "topP": 0.7
                    }
                }
            }
            ws.send(json.dumps(data))
            r1 = None
            while r1 is None:
                m1 = ws.recv()
                j1 = json.loads(m1)
                a1 = j1.get("action")
                if "final_response" == a1:
                    r1 = j1.get("data", {}).get("content")
                if "error" == a1:
                    print("M1:" + str(m1))
            return j1

        with closing(websocket.create_connection(self.SOCKET_URL, header={"x-api-key": self.API_TOKEN})) as ws:
            j1 = send_query(ws, prompt)

        output2 = j1['data']['content']
        
        file_path = f"output2_{self.session_id}.txt"
        # Write output2 to the file
        with open(file_path, "a") as file:  # Open file in append mode
            file.write(output2 + "\n")  # Add a newline for separation
            
        output = output2.replace("Here is a JSON object with the step-by-step plan as requested:", "")
        #print("Raw Model Output:", output)  # Debug print
        if self.stop_word:
            stop_index = output.find(self.stop_word)
            
            output = output[:stop_index]

        return output

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        """Get the identifying parameters."""
        return {
            "model_name": self.model_name,
            "session_id": self.session_id,
            'SOCKET_URL': self.SOCKET_URL,
            'API_TOKEN': '<hidden>',
            'temperature': self.temperature
        }

    

    def with_structured_output(
        self,
        schema: Optional[Union[type[BaseModel], Dict[str, Any]]] = None,
        *,
        method: Literal["function_calling", "json_mode"] = "function_calling",
        include_raw: bool = False,
        **kwargs: Any
    ) -> Runnable:
        """
        Returns a runnable that generates output structured according to the given schema.

        Args:
            schema: Pydantic model or dictionary schema for structured output
            method: Method for structured output generation
            include_raw: Whether to include raw model output alongside parsed output
            kwargs: Additional keyword arguments

        Returns:
            Runnable that generates structured output
        """
        def _is_pydantic_class(obj: Any) -> bool:
            return isinstance(obj, type) and issubclass(obj, BaseModel)

        # Validate inputs
        if schema is None:
            raise ValueError("Schema must be specified for structured output")

        # Determine output parser based on schema type
        is_pydantic_schema = _is_pydantic_class(schema)

        # Prepare the model call based on method
        if method == "function_calling":
            # Prepare tool-calling approach
            tool = convert_to_openai_tool(schema)
            tool_name = tool['function']['name']

            # Prepare model with tool binding
            bound_model = self.bind(
                tools=[schema],
                tool_choice={"type": "function", "function": {"name": tool_name}}
            )

            # Choose appropriate output parser
            if is_pydantic_schema:
                output_parser = PydanticOutputParser(pydantic_object=schema)
            else:
                output_parser = JsonOutputParser()

        elif method == "json_mode":
            # Prepare model for JSON mode
            bound_model = self.bind(response_format={"type": "json_object"})

            # Choose appropriate output parser
            if is_pydantic_schema:
                output_parser = PydanticOutputParser(pydantic_object=schema)
            else:
                output_parser = JsonOutputParser()
        else:
            raise ValueError(f"Unsupported method: {method}")

        
        # Handle raw output inclusion
        if include_raw:
            parser_assign = RunnablePassthrough.assign(
                parsed=itemgetter("raw") | output_parser,
                parsing_error=lambda _: None
            )
            parser_none = RunnablePassthrough.assign(parsed=lambda _: None)
            parser_with_fallback = parser_assign.with_fallbacks(
                [parser_none], exception_key="parsing_error"
            )
            return RunnableMap(raw=bound_model) | parser_with_fallback
        else:
            return bound_model | output_parser



# Commented out IPython magic to ensure Python compatibility.
# %pip install instructor

SOCKET_URL = "wss://ws.generative.engine.capgemini.com/"
session_id=str(uuid4())

import getpass
import os


import subprocess
from langchain.agents import tool

@tool
def run_shell_command(command: str) -> str:

    """ Execute a shell command and return its output """
    try:
        # Execute the command and capture the output
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return f"An error occurred while executing the command: {e}"

from tempfile import TemporaryDirectory
from langchain_community.agent_toolkits import FileManagementToolkit
toolkit = FileManagementToolkit()  # If you don't provide a root_dir, operations will default to the current working directory
tools_os = FileManagementToolkit(selected_tools=["read_file", "write_file", "list_directory"],
).get_tools()
read_tool, write_tool, list_tool = tools_os

tools = [run_shell_command,read_tool, write_tool, list_tool]

system="""
You are designed to solve tasks. Each task requires multiple steps that are represented by a markdown code snippet of a json blob.
The json structure should contain the following keys:
thought -> your thoughts
action -> name of a tool
action_input -> parameters to send to the tool

These are the tools you can use: {tool_names}.

These are the tools descriptions:

{tools}

If you have enough information to answer the query use the tool "Final Answer". Its parameters is the solution.
If there is not enough information, keep trying.

"""

human="""
Add the word "STOP" after each markdown snippet. Example:

```json
{{"thought": "<your thoughts>",
 "action": "<tool name or Final Answer to give a final answer>",
 "action_input": "<tool parameters or the final output"}}
```
STOP

This is my query="{input}". Write only the next step needed to solve it.
Your answer should be based in the previous tools executions, even if you think you know the answer.

These were the previous steps given to solve this query and the information you already gathered:
"""



prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        MessagesPlaceholder("chat_history", optional=True),
        ("human", human),
        MessagesPlaceholder("agent_scratchpad"),
    ]
)



from langchain import hub
#from langchain_openai import ChatOpenAI
#from langgraph.prebuilt import create_react_agent
# Get the prompt to use - you can modify this!
#prompt = hub.pull("ih/ih-react-agent-executor")
#prompt.pretty_print()


# Choose the LLM that will drive the agent
#llm = ChatOpenAI(model="gpt-4-turbo-preview")
#agent_executor = create_react_agent(llm, tools, state_modifier=prompt)
llm = CustomLLM(model_name='openai.gpt-4o',
                session_id=session_id,SOCKET_URL=SOCKET_URL,
                API_TOKEN=API_TOKEN,
                temperature=0.0,maxTokens=4000)
agent = create_json_chat_agent(
    tools = tools,
    llm = llm,
    prompt = prompt,
    stop_sequence = ["STOP"],
    template_tool_response = "{observation}"
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)

#agent_executor.invoke({"messages": [("user", "list the file in the current directory")]})
#agent_executor.invoke({"input":"list the file in the current directory"})

import operator
from typing import Annotated, List, Tuple
from typing_extensions import TypedDict


class PlanExecute(TypedDict):
    input: str
    plan: List[str]
    past_steps: List[Tuple[str, str]]
    response: str
    agent_scratchpad: str

from pydantic import BaseModel, Field


# Define the Plan model correctly
class Plan(BaseModel):
    """Plan to follow in future"""
    steps: List[str] = Field(
        description="different steps to follow, should be in sorted order"
    )

# Update the planner prompt
planner_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """For the given objective, come up with a simple step-by-step plan. 
    This plan should involve individual tasks, that if executed correctly will yield the correct answer. 
    The result of the final step should be the final answer. Make sure that each step has all the information needed. 
    Return your response as a JSON object with a single key "steps", which is a list of step descriptions. 
    here an example of response : {steps=["do this...", "di this ..", 'do this ...']}
    DON'T ADD ANYTHING before or after the Json in the response!"""
        ),
        ("human", "{input}")
    ]
)

planner_system="""For the given objective, come up with a simple step-by-step plan. 
    This plan should involve individual tasks, that if executed correctly will yield the correct answer. 
    The result of the final step should be the final answer. Make sure that each step has all the information needed."""
planner_human="{messages}"
    
planner_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", planner_system),        
        ("placeholder", "{messages}"),
    ]
)


#planner = planner_prompt | ChatOpenAI(    model="gpt-4o", temperature=0).with_structured_output(Plan)
planner = planner_prompt | CustomLLM(model_name='openai.gpt-4o',
                                      session_id=session_id,SOCKET_URL=SOCKET_URL,API_TOKEN=API_TOKEN,
                                     temperature=0.0,maxTokens=4000).with_structured_output(Plan)

from typing import Union

class Response(BaseModel):
    """Response to user."""

    response: str


class Act(BaseModel):
    """Action to perform."""
    action: Union[Response, Plan]


replanner_prompt = ChatPromptTemplate.from_template(
    """For the given objective, update your plan accordingly based on the steps already completed.

Your objective was:
{input}

Your original plan was:
{plan}

You have completed the following steps:
{past_steps}

If no more steps are needed and you can respond to the user, output a JSON object in the following format:

```json
{{
  "action": {{
    "response": "<Your response to the user>"
  }}
}}```

If more steps are needed, output a JSON object in this format:

```{{
  "action": {{
    "steps": ["<List of remaining steps>"]
  }}
}}```

Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that. Otherwise, fill out the plan. Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan."""
)


#replanner = replanner_prompt | ChatOpenAI(    model="gpt-4o", temperature=0).with_structured_output(Act)

replanner = replanner_prompt | CustomLLM(model_name='openai.gpt-4o',
                                         session_id=session_id,SOCKET_URL=SOCKET_URL,API_TOKEN=API_TOKEN,temperature=0.0,maxTokens=4000).with_structured_output(Act)

from typing import Literal
from langgraph.graph import END


async def execute_step(state: PlanExecute):
    plan = state["plan"]
    if not plan:
        state["response"] = "No more steps in the plan."
        return state
    task = plan.pop(0)  # Get the next task
    plan_str = "\n".join(f"{i+1}. {step}" for i, step in enumerate(plan))
    task_formatted = f"""For the following plan:
{plan_str}\n\nYou are tasked with executing step {len(state['past_steps']) + 1}, {task}."""
    agent_input = {
        "input": task_formatted,
        "agent_scratchpad": state.get("agent_scratchpad", ""),
    }
    agent_response = await agent_executor.ainvoke(agent_input)
    # Update past steps and agent_scratchpad
    state["past_steps"].append((task, agent_response["output"]))
    state["agent_scratchpad"] += f"\nStep {len(state['past_steps'])}: {agent_response['output']}"
    return state



async def plan_step(state: PlanExecute):
    planner_input = {"input": state["input"]}
    plan_result = await planner.ainvoke(planner_input)
    state["plan"] = plan_result.steps
    return state


async def replan_step(state: PlanExecute):
    replanner_input = {
        "input": state["input"],
        "plan": state["plan"],
        "past_steps": state["past_steps"],
    }
    output = await replanner.ainvoke(replanner_input)
    if isinstance(output.action, Response):
        state["response"] = output.action.response
    else:
        state["plan"] = output.action.steps
    return state


def should_end(state: PlanExecute):
    if "response" in state and state["response"]:
        return END
    elif state["plan"]:
        return "agent"
    else:
        return "replan"

from langgraph.graph import StateGraph, START

workflow = StateGraph(PlanExecute)

# Add the plan node
workflow.add_node("planner", plan_step)

# Add the execution step
workflow.add_node("agent", execute_step)

# Add a replan node
workflow.add_node("replan", replan_step)

workflow.add_edge(START, "planner")

# From plan we go to agent
workflow.add_edge("planner", "agent")

# From agent, we replan
workflow.add_edge("agent", "replan")

workflow.add_conditional_edges(
    "replan",
    # Next, we pass in the function that will determine which node is called next.
    should_end,
    ["agent", END],
)

# Finally, we compile it!
# This compiles it into a LangChain Runnable,
# meaning you can use it as you would any other runnable
app = workflow.compile()

config = {"recursion_limit": 50}

import asyncio

# Add this function definition
def process_event(event):
    # Your logic to process the event
    print(event)  # Example: print the event data

# Define an async function to handle streaming events
async def run_gen_ai_agent(input_text):
    inputs = {
        "input": input_text,
        "agent_scratchpad": "",
        "plan": [],
        "past_steps": [],
        "response": "",
    }
    config = {"recursion_limit": 50}
    events = []

    async def stream_events(inputs, config):
        async for event in app.astream(inputs, config=config):
            # Process each event and collect the results
            process_event(event)
            events.append(event)

    await stream_events(inputs, config)
    return {"status": "success", "data": events}


