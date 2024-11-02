import WorkspaceComponent from "@/components/workspace/WorkspaceComponent";

// Define the type for searchParams
type SearchParams = {
  name: string;
  showFilter: string;
  showCategories: string;
  logo: string;
  orgLogo: string;
  zikoroLogo: string;
};

// Define props type for the Payment component
type WorkspacesProps = {
  searchParams: SearchParams;
};

export default function Workspaces({ searchParams }: WorkspacesProps) {
  return (
    <div>
      <WorkspaceComponent searchParams={searchParams} />
    </div>
  );
}
