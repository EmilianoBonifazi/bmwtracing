import React from "react";
import { Layout } from "@/components/Layout";
import { WorkItemList } from "@/components/WorkItemList";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Work Items</h1>
          <p className="text-gray-600 mt-2">View and manage your diagnostic work items</p>
        </div>
        <WorkItemList />
      </div>
    </Layout>
  );
};

export default Index;