import React from "react";

import { AcquiredIdToken, Manifest, VCRequest } from "../../../types";
import { Layout } from "../../Layout";
import { Issue } from "../organisms/Issue";

export interface IssueTemplateProps {
  vcRequest: VCRequest;
  manifest: Manifest;
  acquiredAttestation: AcquiredIdToken;
}

export const IssueTemplate: React.FC<IssueTemplateProps> = ({ vcRequest, manifest, acquiredAttestation }) => {
  return (
    <Layout>
      <Issue vcRequest={vcRequest} manifest={manifest} acquiredAttestation={acquiredAttestation} />
    </Layout>
  );
};
