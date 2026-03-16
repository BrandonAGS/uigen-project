import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// str_replace_editor commands
test("ToolCallBadge shows Creating label for str_replace_editor create", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/App.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Creating `App.tsx`")).toBeDefined();
});

test("ToolCallBadge shows Editing label for str_replace_editor str_replace", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "src/Button.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Editing `Button.tsx`")).toBeDefined();
});

test("ToolCallBadge shows Editing label for str_replace_editor insert", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "src/utils.ts" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Editing `utils.ts`")).toBeDefined();
});

test("ToolCallBadge shows Reading label for str_replace_editor view", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "src/index.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Reading `index.tsx`")).toBeDefined();
});

test("ToolCallBadge shows Undoing edit label for str_replace_editor undo_edit", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "src/App.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Undoing edit")).toBeDefined();
});

// file_manager commands
test("ToolCallBadge shows Renaming label for file_manager rename", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Renaming `Old.tsx` → `New.tsx`")).toBeDefined();
});

test("ToolCallBadge shows Deleting label for file_manager delete", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "src/Unused.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Deleting `Unused.tsx`")).toBeDefined();
});

// State: pending — spinner shown, label still appears
test("ToolCallBadge shows label and spinner when state is call", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating `App.tsx`")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

// State: result with result — green dot, no spinner
test("ToolCallBadge shows green dot when completed", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// State: result with no result — spinner (not yet done)
test("ToolCallBadge shows spinner when state is result but result is undefined", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

// Unknown tool — fallback to raw toolName
test("ToolCallBadge falls back to raw toolName for unknown tools", () => {
  render(
    <ToolCallBadge
      toolName="some_unknown_tool"
      args={{}}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});
