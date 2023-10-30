import { SelectionRange, StateEffect, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { createRoot } from "react-dom/client";

import { Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";

import { addComment } from "./comments";

interface ContextMenuPosition {
  top: number;
  left: number;
}

export const showContextMenu = StateEffect.define<ContextMenuPosition>();
export const hideContextMenu = StateEffect.define<boolean>();

export const setSelection = StateEffect.define<SelectionRange>();
export const selection = StateField.define<SelectionRange | undefined>({
  create() {
    return undefined;
  },
  update(oldSelection, tr) {
    for (const e of tr.effects) {
      if (e.is(setSelection)) {
        return e.value;
      }
    }
    return oldSelection;
  },
});

class ContextMenuWidget extends WidgetType {
  constructor(private readonly position?: ContextMenuPosition) {
    super();
  }

  eq(widget: WidgetType): boolean {
    return (
      this.position?.top === (widget as ContextMenuWidget).position?.top &&
      this.position?.left === (widget as ContextMenuWidget).position?.left
    );
  }

  toDOM(): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "cm-context-menu";
    const root = createRoot(dom);
    root.render(
      /* <Menu
        id="cm-context-menu"
        open={this.position !== undefined}
        anchorReference="anchorPosition"
        anchorPosition={
          this.position !== undefined
            ? { top: this.position.top, left: this.position.left }
            : undefined
        }
      >
        <MenuItem id="cm-context-menu-comment">Create comment</MenuItem>
      </Menu> */
      <Popper
        id="cm-context-menu"
        open={this.position !== undefined}
        anchorEl={
          this.position
            ? {
                getBoundingClientRect: () => {
                  return {
                    top: this.position?.top ?? 0,
                    left: this.position?.left ?? 0,
                    right: this.position?.left ?? 0,
                    bottom: this.position?.top ?? 0,
                    width: 0,
                    height: 0,
                    x: 0,
                    y: 0,
                    toJSON(): any {},
                  } satisfies DOMRect;
                },
              }
            : undefined
        }
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper>
              <MenuList>
                <MenuItem id="cm-context-menu-comment">Create comment</MenuItem>
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
    return dom;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

const contextMenuField = (): StateField<DecorationSet> =>
  StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(oldContextMenu, tr) {
      let contextMenu = oldContextMenu.map(tr.changes);
      for (const e of tr.effects) {
        if (e.is(showContextMenu)) {
          const addUpdates = [];

          addUpdates.push(
            Decoration.widget({
              widget: new ContextMenuWidget(e.value),
              block: false,
            }).range(0)
          );

          contextMenu = contextMenu.update({
            add: addUpdates,
            filter: () => {
              return false;
            },
          });
        } else if (e.is(hideContextMenu)) {
          contextMenu = contextMenu.update({
            filter: () => {
              return false;
            },
          });
        }
      }

      return contextMenu;
    },
    provide: (f) => EditorView.decorations.from(f),
  });

export function contextMenuExtension(userId: string): any[] {
  return [
    contextMenuField(),
    selection,
    ViewPlugin.define(
      () => {
        return {
          update(update: ViewUpdate) {},
        };
      },
      {
        eventHandlers: {
          contextmenu: (event: MouseEvent, view: EditorView) => {
            event.preventDefault();
            view.dispatch({
              effects: [
                showContextMenu.of({
                  top: event.clientY + 2,
                  left: event.clientX + 2,
                }),
                setSelection.of(view.state.selection.main),
              ],
            });
          },
          click: (event: MouseEvent, view: EditorView) => {
            const target = event.target as HTMLElement;
            if (target.id === "cm-context-menu-comment") {
              const s = view.state.field(selection);
              view.dispatch({
                effects: addComment.of({
                  id: crypto.randomUUID(),
                  from: s?.from ?? 0,
                  to: s?.to ?? 0,
                  content: "Lorem ipsum",
                  createdBy: userId,
                }),
              });
            }
            view.dispatch({
              effects: hideContextMenu.of(true),
            });
          },
        },
      }
    ),
  ];
}
