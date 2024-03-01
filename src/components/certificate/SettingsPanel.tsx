import { useEditor } from "@craftjs/core";
import React from "react";

const SettingsPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
      isEnabled: state.options.enabled,
    };
  });

  return isEnabled && selected ? (
    <div className="px-2 py-2 flex gap-2 w-full">
      <div data-cy="settings-panel" className="flex-1">
        {selected.settings && React.createElement(selected.settings)}
      </div>
      {selected.isDeletable ? (
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => {
            actions.delete(selected.id);
          }}
        >
          Delete
        </button>
      ) : null}
    </div>
  ) : null;
};

export default SettingsPanel;
