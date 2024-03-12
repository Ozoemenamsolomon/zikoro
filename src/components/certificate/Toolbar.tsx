import { useEditor, Element } from "@craftjs/core";
import Text from "./Text";

const Toolbar = () => {
  const { connectors } = useEditor();

  return (
    <div className="px-2 py-2">
      <div className="grid grid-cols-1 justify-center items-center gap-1">
        <div className="pb-2">
          <p>Drag to add</p>
        </div>
        <div className="flex flex-col">
          <button
            ref={(ref) => ref && connectors.create(ref, <Text text="Hi world" />)}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            data-cy="toolbox-text"
          >
            Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;