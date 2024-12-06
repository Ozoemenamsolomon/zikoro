"use client";

import { fabric } from "fabric";
// import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";

// import { ResponseType } from "@/components/projects/api/use-get-project";
// import { useUpdateProject } from "@/components/projects/api/use-update-project";

import { ActiveTool, selectionDependentTools } from "@/components/editor/types";
import { Navbar } from "@/components/editor/components/navbar";
import { Footer } from "@/components/editor/components/footer";
import { useEditor } from "@/components/editor/hooks/use-editor";
import { Sidebar } from "@/components/editor/components/sidebar";
import { Toolbar } from "@/components/editor/components/toolbar";
import { ShapeSidebar } from "@/components/editor/components/shape-sidebar";
import { FillColorSidebar } from "@/components/editor/components/fill-color-sidebar";
import { StrokeColorSidebar } from "@/components/editor/components/stroke-color-sidebar";
import { StrokeWidthSidebar } from "@/components/editor/components/stroke-width-sidebar";
import { OpacitySidebar } from "@/components/editor/components/opacity-sidebar";
import { TextSidebar } from "@/components/editor/components/text-sidebar";
import { FontSidebar } from "@/components/editor/components/font-sidebar";
import { ImageSidebar } from "@/components/editor/components/image-sidebar";
import { FilterSidebar } from "@/components/editor/components/filter-sidebar";
import { DrawSidebar } from "@/components/editor/components/draw-sidebar";
// import { AiSidebar } from "@/components/editor/components/ai-sidebar";
import { TemplateSidebar } from "@/components/editor/components/template-sidebar";
import { RemoveBgSidebar } from "@/components/editor/components/remove-bg-sidebar";
import { SettingsSidebar } from "@/components/editor/components/settings-sidebar";
import { BackgroundSidebar } from "./background-sidebar";

interface EditorProps {
  initialData: ResponseType["data"];
  name: string;
  setName: (name: string) => void;
  organizationId: string;
}

export const Editor = ({
  initialData,
  name,
  setName,
  organizationId,
}: EditorProps) => {
  // const { mutate } = useUpdateProject(initialData.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const debouncedSave = useCallback(
  //   debounce((values: { json: string; height: number; width: number }) => {
  //     // mutate(values);
  //   }, 500),
  //   [mutate],
  // );

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    defaultState: initialData?.json,
    defaultWidth: initialData?.width ?? 900,
    defaultHeight: initialData?.height ?? 1200,
    clearSelectionCallback: onClearSelection,
    // saveCallback: debouncedSave,
  });

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === "draw") {
        editor?.enableDrawingMode();
      }

      if (activeTool === "draw") {
        editor?.disableDrawingMode();
      }

      if (tool === activeTool) {
        return setActiveTool("select");
      }

      setActiveTool(tool);
    },
    [activeTool, editor]
  );

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="flex h-full flex-col">
      <Navbar
        id={initialData?.id ?? 1}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
        setName={setName}
        name={name}
      />
      <div className="absolute top-[68px] flex h-[calc(100%-68px)] w-full">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <BackgroundSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          organizationId={organizationId}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          organizationId={organizationId}
        />
        {/* <TemplateSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        /> */}
        <FilterSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        {/* <AiSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        /> */}
        {/* <RemoveBgSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        /> */}
        <DrawSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <SettingsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="relative flex flex-1 flex-col overflow-auto bg-muted">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            className="h-[calc(100%-124px)] flex-1 bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};
