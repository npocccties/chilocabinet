import React from "react";

import { Layout } from "../../Layout";
import { Result } from "../organisms/Result";

export interface ResultTemplateProps {
  type: "issue" | "present" | "scanner";
  result: boolean;
  errorMessage: string | undefined;
}

export const ResultTemplate: React.FC<ResultTemplateProps> = ({ type, result, errorMessage }) => {
  return (
    <Layout>
      <Result type={type} result={result} errorMessage={errorMessage} />
    </Layout>
  );
};
