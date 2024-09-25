import React, { useEffect } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import {
  DEFAULT_SECTIONS,
  ElementsSection,
  LayersSection,
  PhotosSection,
  SectionTab,
  SidePanel,
  TextSection,
  UploadSection,
} from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";

import "@blueprintjs/core/lib/css/blueprint.css";

import { createStore, StoreProps, StoreType } from "polotno/model/store";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// define the new custom section
const CustomSection = {
  name: "custom-text",
  // use "empty" tab that will render nothing
  Tab: () => null,
  // we need observer to update component automatically on any store changes
  Panel: observer(({ store }) => {
    const text = store.selectedElements[0]?.text;
    return (
      <div className="py-8 space-y-6">
        <h1 className="text-2xl font-medium">Variables</h1>
        <div className="grid grid-cols-2 gap-4">
          <button
            className={
              "bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"
            }
            onClick={() =>
              store.selectedElements[0].set({ text: "#{first name#}" })
            }
          >
            First Name
          </button>
          <button
            className={
              "bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"
            }
            onClick={() =>
              store.selectedElements[0].set({ text: "#{last name#}" })
            }
          >
            Last Name
          </button>
          <button
            className={
              "bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"
            }
            onClick={() =>
              store.selectedElements[0].set({
                text: "#{first name#} #{last name#}",
              })
            }
          >
            Full Name
          </button>
          <button
            className={
              "bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"
            }
            onClick={() =>
              store.selectedElements[0].set({
                text: "#{_id#}",
              })
            }
          >
            Certificate ID
          </button>
          <button
            className={
              "bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"
            }
            onClick={() =>
              store.selectedElements[0].set({
                text: "#{event_name#}",
              })
            }
          >
            Event name
          </button>
          <button
            className={
              "bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"
            }
            onClick={() =>
              store.selectedElements[0].set({
                text: "#{organization_name#}",
              })
            }
          >
            Organization name
          </button>
        </div>
      </div>
    );
  }),
};

// add new section to side bar
const sections = [...DEFAULT_SECTIONS, CustomSection];

const store = createStore({
  key: "eRgdTo7tBc2jBeTZrFnC", // you can create it here: https://polotno.com/cabinet/
  // you can hide back-link on a paid license
  // but it will be good if you can keep it for Polotno project support
  showCredit: true,
});

// use mobx reaction to react to selection changes
reaction(
  () => {
    console.log("here");
    const textSelected = store.selectedElements[0]?.type === "text";
    return textSelected;
  },
  // we can use result returned from reaction
  (textSelected) => {
    if (textSelected) {
      store.openSidePanel("custom-text");
    }
  }
);

const page = store.addPage({
  width: 595,
  height: 842,
});

const ActionControls = ({
  store,
  onSave,
  isLoading,
}: {
  store: StoreType;
  onSave: (store: StoreType) => void;
  isLoading: boolean;
}) => {
  return (
    <div>
      <Button
        className="bg-basePrimary"
        onClick={() => onSave(store)}
        disabled={isLoading}
      >
        Save
      </Button>
    </div>
  );
};

export const Editor = ({
  json,
  onSave,
  isLoading,
}: {
  json: Record<string, any>;
  onSave: (store: StoreType) => void;
  isLoading: boolean;
}) => {
  useEffect(() => {
    if (json) store.loadJSON(json);
  }, [json]);

  return (
    <PolotnoContainer style={{ width: "100%", height: "100%" }}>
      <SidePanelWrap>
        <SidePanel sections={sections} store={store} />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar
          store={store}
          components={{
            ActionControls: () => (
              <ActionControls
                isLoading={isLoading}
                store={store}
                onSave={onSave}
              />
            ),
          }}
        />
        <Workspace
          store={store}
          backgroundColor="#F9FAFF"
          pageBorderColor="black"
          activePageBorderColor="red"
          renderOnlyActivePage
          pageControlsEnabled={false}
        />
        <ZoomButtons store={store} />
        {/* <PagesTimeline store={store} /> */}
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

export default Editor;
