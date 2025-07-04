export type CB<T> = () => T;
export type TAny = any;
type Bool = boolean | 'true' | 'false';
export type EObject = {};
type Merge<A, B> = {
  [K in keyof (A & B)]: K extends keyof B
    ? B[K]
    : K extends keyof A
      ? A[K]
      : never;
};
export type ValueOf<T> = T[keyof T];
export type JSXElement<T = EObject> = {
  type: string | FC<T>;
  props: T | null | undefined;
};
export type JSXProps<P = EObject> = Merge<
  {
    children?: JSXNode;
    $props?: { [k in keyof P]: CB<P[k]> };
    $set?: <T extends keyof P>(
      props: Partial<Record<T, (prev: P[T]) => P[T]>>
    ) => void;
    $default?: (defaultProps: Partial<JSXProps<P>>) => void;
  },
  P
>;
export type JSXNode<T = EObject> =
  | JSXNode<T>[]
  | JSXElement<T>
  | CB<T>
  | string
  | number
  | boolean
  | null
  | undefined;
export type FC<T = EObject> = (props: JSXProps<T>) => JSXElement;
export type AsyncFC<T = EObject> = (
  props: JSXProps<T>
) => Promise<CB<JSXElement>>;
/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent) */
interface CommandEvent extends Event {
  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/source) */
  readonly source: Element | null;
  /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/command) */
  readonly command: string;
}
export type Value<T> = T | CB<T>;
/**
 * namespace JSXInternal.
 */
export declare namespace JSXInternal {
  export interface AriaAttributes {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    'aria-activedescendant'?: Value<string | undefined>;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    'aria-atomic'?: Value<Bool | undefined>;
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    'aria-autocomplete'?: Value<
      'none' | 'inline' | 'list' | 'both' | undefined
    >;
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    /**
     * Defines a string value that labels the current element, which is intended to be converted into Braille.
     * @see aria-label.
     */
    'aria-braillelabel'?: Value<string | undefined>;
    /**
     * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
     * @see aria-roledescription.
     */
    'aria-brailleroledescription'?: Value<string | undefined>;
    'aria-busy'?: Value<Bool | undefined>;
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    'aria-checked'?: Value<boolean | 'false' | 'mixed' | 'true' | undefined>;
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    'aria-colcount'?: Value<number | undefined>;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    'aria-colindex'?: Value<number | undefined>;
    /**
     * Defines a human readable text alternative of aria-colindex.
     * @see aria-rowindextext.
     */
    'aria-colindextext'?: Value<string | undefined>;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    'aria-colspan'?: Value<number | undefined>;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    'aria-controls'?: Value<string | undefined>;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    'aria-current'?: Value<
      | boolean
      | 'false'
      | 'true'
      | 'page'
      | 'step'
      | 'location'
      | 'date'
      | 'time'
      | undefined
    >;
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    'aria-describedby'?: Value<string | undefined>;
    /**
     * Defines a string value that describes or annotates the current element.
     * @see related aria-describedby.
     */
    'aria-description'?: Value<string | undefined>;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    'aria-details'?: Value<string | undefined>;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    'aria-disabled'?: Value<Bool | undefined>;
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    'aria-dropeffect'?: Value<
      'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined
    >;
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    'aria-errormessage'?: Value<string | undefined>;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    'aria-expanded'?: Value<Bool | undefined>;
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    'aria-flowto'?: Value<string | undefined>;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    'aria-grabbed'?: Value<Bool | undefined>;
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    'aria-haspopup'?: Value<
      | boolean
      | 'false'
      | 'true'
      | 'menu'
      | 'listbox'
      | 'tree'
      | 'grid'
      | 'dialog'
      | undefined
    >;
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    'aria-hidden'?: Value<Bool | undefined>;
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    'aria-invalid'?: Value<
      boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined
    >;
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    'aria-keyshortcuts'?: Value<string | undefined>;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    'aria-label'?: Value<string | undefined>;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    'aria-labelledby'?: Value<string | undefined>;
    /** Defines the hierarchical level of an element within a structure. */
    'aria-level'?: Value<number | undefined>;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    'aria-live'?: Value<'off' | 'assertive' | 'polite' | undefined>;
    /** Indicates whether an element is modal when displayed. */
    'aria-modal'?: Value<Bool | undefined>;
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    'aria-multiline'?: Value<Bool | undefined>;
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    'aria-multiselectable'?: Value<Bool | undefined>;
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    'aria-orientation'?: Value<'horizontal' | 'vertical' | undefined>;
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    'aria-owns'?: Value<string | undefined>;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    'aria-placeholder'?: Value<string | undefined>;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    'aria-posinset'?: Value<number | undefined>;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    'aria-pressed'?: Value<boolean | 'false' | 'mixed' | 'true' | undefined>;
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    'aria-readonly'?: Value<Bool | undefined>;
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    'aria-relevant'?: Value<
      | 'additions'
      | 'additions removals'
      | 'additions text'
      | 'all'
      | 'removals'
      | 'removals additions'
      | 'removals text'
      | 'text'
      | 'text additions'
      | 'text removals'
      | undefined
    >;
    /** Indicates that user input is required on the element before a form may be submitted. */
    'aria-required'?: Value<Bool | undefined>;
    /** Defines a human-readable, author-localized description for the role of an element. */
    'aria-roledescription'?: Value<string | undefined>;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    'aria-rowcount'?: Value<number | undefined>;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    'aria-rowindex'?: Value<number | undefined>;
    /**
     * Defines a human readable text alternative of aria-rowindex.
     * @see aria-colindextext.
     */
    'aria-rowindextext'?: Value<string | undefined>;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    'aria-rowspan'?: Value<number | undefined>;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    'aria-selected'?: Value<Bool | undefined>;
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    'aria-setsize'?: Value<number | undefined>;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    'aria-sort'?: Value<
      'none' | 'ascending' | 'descending' | 'other' | undefined
    >;
    /** Defines the maximum allowed value for a range widget. */
    'aria-valuemax'?: Value<number | undefined>;
    /** Defines the minimum allowed value for a range widget. */
    'aria-valuemin'?: Value<number | undefined>;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    'aria-valuenow'?: Value<number | undefined>;
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    'aria-valuetext'?: Value<string | undefined>;
  }
  /** All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions */
  type AriaRole =
    | 'alert'
    | 'alertdialog'
    | 'application'
    | 'article'
    | 'banner'
    | 'button'
    | 'cell'
    | 'checkbox'
    | 'columnheader'
    | 'combobox'
    | 'complementary'
    | 'contentinfo'
    | 'definition'
    | 'dialog'
    | 'directory'
    | 'document'
    | 'feed'
    | 'figure'
    | 'form'
    | 'grid'
    | 'gridcell'
    | 'group'
    | 'heading'
    | 'img'
    | 'link'
    | 'list'
    | 'listbox'
    | 'listitem'
    | 'log'
    | 'main'
    | 'marquee'
    | 'math'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'navigation'
    | 'none'
    | 'note'
    | 'option'
    | 'presentation'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'region'
    | 'row'
    | 'rowgroup'
    | 'rowheader'
    | 'scrollbar'
    | 'search'
    | 'searchbox'
    | 'separator'
    | 'slider'
    | 'spinbutton'
    | 'status'
    | 'switch'
    | 'tab'
    | 'table'
    | 'tablist'
    | 'tabpanel'
    | 'term'
    | 'textbox'
    | 'timer'
    | 'toolbar'
    | 'tooltip'
    | 'tree'
    | 'treegrid'
    | 'treeitem'
    | (string & {});
  type DOMCSSProperties = {
    [key in keyof Omit<
      CSSStyleDeclaration,
      | 'item'
      | 'setProperty'
      | 'removeProperty'
      | 'getPropertyValue'
      | 'getPropertyPriority'
    >]?: string | number | null | undefined;
  };
  type AllCSSProperties = {
    [key: string]: string | number | null | undefined;
  };
  type TKey = string | number | Record<string, TAny> | Record<TAny, TAny>;
  export interface CSSProperties extends AllCSSProperties, DOMCSSProperties {}
  export type TargetedEvent<
    Target extends EventTarget = EventTarget,
    TypedEvent extends Event = Event,
  > = Omit<TypedEvent, 'currentTarget'> & {
    readonly currentTarget: Target;
    target: Target & {
      value: TAny;
    };
  };
  export type TargetedAnimationEvent<Target extends EventTarget> =
    TargetedEvent<Target, AnimationEvent>;
  export type TargetedClipboardEvent<Target extends EventTarget> =
    TargetedEvent<Target, ClipboardEvent>;
  export type TargetedCommandEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    CommandEvent
  >;
  export type TargetedCompositionEvent<Target extends EventTarget> =
    TargetedEvent<Target, CompositionEvent>;
  export type TargetedDragEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    DragEvent
  >;
  export type TargetedFocusEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    FocusEvent
  >;
  export type TargetedInputEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    InputEvent
  >;
  export type TargetedKeyboardEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    KeyboardEvent
  >;
  export type TargetedMouseEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    MouseEvent
  >;
  export type TargetedPointerEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    PointerEvent
  >;
  export type TargetedSubmitEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    SubmitEvent
  >;
  export type TargetedTouchEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    TouchEvent
  >;
  export type TargetedToggleEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    ToggleEvent
  >;
  export type TargetedTransitionEvent<Target extends EventTarget> =
    TargetedEvent<Target, TransitionEvent>;
  export type TargetedUIEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    UIEvent
  >;
  export type TargetedWheelEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    WheelEvent
  >;
  export type TargetedPictureInPictureEvent<Target extends EventTarget> =
    TargetedEvent<Target, PictureInPictureEvent>;
  export type EventHandler<E extends TargetedEvent> = {
    bivarianceHack(event: E): void;
  }['bivarianceHack'];
  export type AnimationEventHandler<Target extends EventTarget> = EventHandler<
    TargetedAnimationEvent<Target>
  >;
  export type ClipboardEventHandler<Target extends EventTarget> = EventHandler<
    TargetedClipboardEvent<Target>
  >;
  export type CommandEventHandler<Target extends EventTarget> = EventHandler<
    TargetedCommandEvent<Target>
  >;
  export type CompositionEventHandler<Target extends EventTarget> =
    EventHandler<TargetedCompositionEvent<Target>>;
  export type DragEventHandler<Target extends EventTarget> = EventHandler<
    TargetedDragEvent<Target>
  >;
  export type ToggleEventHandler<Target extends EventTarget> = EventHandler<
    TargetedToggleEvent<Target>
  >;
  export type FocusEventHandler<Target extends EventTarget> = EventHandler<
    TargetedFocusEvent<Target>
  >;
  export type GenericEventHandler<Target extends EventTarget> = EventHandler<
    TargetedEvent<Target>
  >;
  export type InputEventHandler<Target extends EventTarget> = EventHandler<
    TargetedInputEvent<Target>
  >;
  export type KeyboardEventHandler<Target extends EventTarget> = EventHandler<
    TargetedKeyboardEvent<Target>
  >;
  export type MouseEventHandler<Target extends EventTarget> = EventHandler<
    TargetedMouseEvent<Target>
  >;
  export type PointerEventHandler<Target extends EventTarget> = EventHandler<
    TargetedPointerEvent<Target>
  >;
  export type SubmitEventHandler<Target extends EventTarget> = EventHandler<
    TargetedSubmitEvent<Target>
  >;
  export type TouchEventHandler<Target extends EventTarget> = EventHandler<
    TargetedTouchEvent<Target>
  >;
  export type TransitionEventHandler<Target extends EventTarget> = EventHandler<
    TargetedTransitionEvent<Target>
  >;
  export type UIEventHandler<Target extends EventTarget> = EventHandler<
    TargetedUIEvent<Target>
  >;
  export type WheelEventHandler<Target extends EventTarget> = EventHandler<
    TargetedWheelEvent<Target>
  >;
  export type PictureInPictureEventHandler<Target extends EventTarget> =
    EventHandler<TargetedPictureInPictureEvent<Target>>;
  export interface DOMAttributes<Target extends EventTarget = EventTarget> {
    onLoad?: GenericEventHandler<Target> | undefined;
    onLoadCapture?: GenericEventHandler<Target> | undefined;
    onError?: GenericEventHandler<Target> | undefined;
    onErrorCapture?: GenericEventHandler<Target> | undefined;
    onCopy?: ClipboardEventHandler<Target> | undefined;
    onCopyCapture?: ClipboardEventHandler<Target> | undefined;
    onCut?: ClipboardEventHandler<Target> | undefined;
    onCutCapture?: ClipboardEventHandler<Target> | undefined;
    onPaste?: ClipboardEventHandler<Target> | undefined;
    onPasteCapture?: ClipboardEventHandler<Target> | undefined;
    onCompositionEnd?: CompositionEventHandler<Target> | undefined;
    onCompositionEndCapture?: CompositionEventHandler<Target> | undefined;
    onCompositionStart?: CompositionEventHandler<Target> | undefined;
    onCompositionStartCapture?: CompositionEventHandler<Target> | undefined;
    onCompositionUpdate?: CompositionEventHandler<Target> | undefined;
    onCompositionUpdateCapture?: CompositionEventHandler<Target> | undefined;
    onBeforeToggle?: ToggleEventHandler<Target> | undefined;
    onToggle?: ToggleEventHandler<Target> | undefined;
    onClose?: GenericEventHandler<Target> | undefined;
    onCancel?: GenericEventHandler<Target> | undefined;
    onFocus?: FocusEventHandler<Target> | undefined;
    onFocusCapture?: FocusEventHandler<Target> | undefined;
    onFocusIn?: FocusEventHandler<Target> | undefined;
    onFocusInCapture?: FocusEventHandler<Target> | undefined;
    onFocusOut?: FocusEventHandler<Target> | undefined;
    onFocusOutCapture?: FocusEventHandler<Target> | undefined;
    onBlur?: FocusEventHandler<Target> | undefined;
    onBlurCapture?: FocusEventHandler<Target> | undefined;
    onChange?: GenericEventHandler<Target> | undefined;
    onChangeCapture?: GenericEventHandler<Target> | undefined;
    onInput?: InputEventHandler<Target> | undefined;
    onInputCapture?: InputEventHandler<Target> | undefined;
    onBeforeInput?: InputEventHandler<Target> | undefined;
    onBeforeInputCapture?: InputEventHandler<Target> | undefined;
    onSearch?: GenericEventHandler<Target> | undefined;
    onSearchCapture?: GenericEventHandler<Target> | undefined;
    onSubmit?: SubmitEventHandler<Target> | undefined;
    onSubmitCapture?: SubmitEventHandler<Target> | undefined;
    onInvalid?: GenericEventHandler<Target> | undefined;
    onInvalidCapture?: GenericEventHandler<Target> | undefined;
    onReset?: GenericEventHandler<Target> | undefined;
    onResetCapture?: GenericEventHandler<Target> | undefined;
    onFormData?: GenericEventHandler<Target> | undefined;
    onFormDataCapture?: GenericEventHandler<Target> | undefined;
    onKeyDown?: KeyboardEventHandler<Target> | undefined;
    onKeyDownCapture?: KeyboardEventHandler<Target> | undefined;
    onKeyPress?: KeyboardEventHandler<Target> | undefined;
    onKeyPressCapture?: KeyboardEventHandler<Target> | undefined;
    onKeyUp?: KeyboardEventHandler<Target> | undefined;
    onKeyUpCapture?: KeyboardEventHandler<Target> | undefined;
    onAbort?: GenericEventHandler<Target> | undefined;
    onAbortCapture?: GenericEventHandler<Target> | undefined;
    onCanPlay?: GenericEventHandler<Target> | undefined;
    onCanPlayCapture?: GenericEventHandler<Target> | undefined;
    onCanPlayThrough?: GenericEventHandler<Target> | undefined;
    onCanPlayThroughCapture?: GenericEventHandler<Target> | undefined;
    onDurationChange?: GenericEventHandler<Target> | undefined;
    onDurationChangeCapture?: GenericEventHandler<Target> | undefined;
    onEmptied?: GenericEventHandler<Target> | undefined;
    onEmptiedCapture?: GenericEventHandler<Target> | undefined;
    onEncrypted?: GenericEventHandler<Target> | undefined;
    onEncryptedCapture?: GenericEventHandler<Target> | undefined;
    onEnded?: GenericEventHandler<Target> | undefined;
    onEndedCapture?: GenericEventHandler<Target> | undefined;
    onLoadedData?: GenericEventHandler<Target> | undefined;
    onLoadedDataCapture?: GenericEventHandler<Target> | undefined;
    onLoadedMetadata?: GenericEventHandler<Target> | undefined;
    onLoadedMetadataCapture?: GenericEventHandler<Target> | undefined;
    onLoadStart?: GenericEventHandler<Target> | undefined;
    onLoadStartCapture?: GenericEventHandler<Target> | undefined;
    onPause?: GenericEventHandler<Target> | undefined;
    onPauseCapture?: GenericEventHandler<Target> | undefined;
    onPlay?: GenericEventHandler<Target> | undefined;
    onPlayCapture?: GenericEventHandler<Target> | undefined;
    onPlaying?: GenericEventHandler<Target> | undefined;
    onPlayingCapture?: GenericEventHandler<Target> | undefined;
    onProgress?: GenericEventHandler<Target> | undefined;
    onProgressCapture?: GenericEventHandler<Target> | undefined;
    onRateChange?: GenericEventHandler<Target> | undefined;
    onRateChangeCapture?: GenericEventHandler<Target> | undefined;
    onSeeked?: GenericEventHandler<Target> | undefined;
    onSeekedCapture?: GenericEventHandler<Target> | undefined;
    onSeeking?: GenericEventHandler<Target> | undefined;
    onSeekingCapture?: GenericEventHandler<Target> | undefined;
    onStalled?: GenericEventHandler<Target> | undefined;
    onStalledCapture?: GenericEventHandler<Target> | undefined;
    onSuspend?: GenericEventHandler<Target> | undefined;
    onSuspendCapture?: GenericEventHandler<Target> | undefined;
    onTimeUpdate?: GenericEventHandler<Target> | undefined;
    onTimeUpdateCapture?: GenericEventHandler<Target> | undefined;
    onVolumeChange?: GenericEventHandler<Target> | undefined;
    onVolumeChangeCapture?: GenericEventHandler<Target> | undefined;
    onWaiting?: GenericEventHandler<Target> | undefined;
    onWaitingCapture?: GenericEventHandler<Target> | undefined;
    onClick?: MouseEventHandler<Target> | undefined;
    onClickCapture?: MouseEventHandler<Target> | undefined;
    onContextMenu?: MouseEventHandler<Target> | undefined;
    onContextMenuCapture?: MouseEventHandler<Target> | undefined;
    onDblClick?: MouseEventHandler<Target> | undefined;
    onDblClickCapture?: MouseEventHandler<Target> | undefined;
    onDrag?: DragEventHandler<Target> | undefined;
    onDragCapture?: DragEventHandler<Target> | undefined;
    onDragEnd?: DragEventHandler<Target> | undefined;
    onDragEndCapture?: DragEventHandler<Target> | undefined;
    onDragEnter?: DragEventHandler<Target> | undefined;
    onDragEnterCapture?: DragEventHandler<Target> | undefined;
    onDragExit?: DragEventHandler<Target> | undefined;
    onDragExitCapture?: DragEventHandler<Target> | undefined;
    onDragLeave?: DragEventHandler<Target> | undefined;
    onDragLeaveCapture?: DragEventHandler<Target> | undefined;
    onDragOver?: DragEventHandler<Target> | undefined;
    onDragOverCapture?: DragEventHandler<Target> | undefined;
    onDragStart?: DragEventHandler<Target> | undefined;
    onDragStartCapture?: DragEventHandler<Target> | undefined;
    onDrop?: DragEventHandler<Target> | undefined;
    onDropCapture?: DragEventHandler<Target> | undefined;
    onMouseDown?: MouseEventHandler<Target> | undefined;
    onMouseDownCapture?: MouseEventHandler<Target> | undefined;
    onMouseEnter?: MouseEventHandler<Target> | undefined;
    onMouseEnterCapture?: MouseEventHandler<Target> | undefined;
    onMouseLeave?: MouseEventHandler<Target> | undefined;
    onMouseLeaveCapture?: MouseEventHandler<Target> | undefined;
    onMouseMove?: MouseEventHandler<Target> | undefined;
    onMouseMoveCapture?: MouseEventHandler<Target> | undefined;
    onMouseOut?: MouseEventHandler<Target> | undefined;
    onMouseOutCapture?: MouseEventHandler<Target> | undefined;
    onMouseOver?: MouseEventHandler<Target> | undefined;
    onMouseOverCapture?: MouseEventHandler<Target> | undefined;
    onMouseUp?: MouseEventHandler<Target> | undefined;
    onMouseUpCapture?: MouseEventHandler<Target> | undefined;
    onAuxClick?: MouseEventHandler<Target> | undefined;
    onAuxClickCapture?: MouseEventHandler<Target> | undefined;
    onSelect?: GenericEventHandler<Target> | undefined;
    onSelectCapture?: GenericEventHandler<Target> | undefined;
    onTouchCancel?: TouchEventHandler<Target> | undefined;
    onTouchCancelCapture?: TouchEventHandler<Target> | undefined;
    onTouchEnd?: TouchEventHandler<Target> | undefined;
    onTouchEndCapture?: TouchEventHandler<Target> | undefined;
    onTouchMove?: TouchEventHandler<Target> | undefined;
    onTouchMoveCapture?: TouchEventHandler<Target> | undefined;
    onTouchStart?: TouchEventHandler<Target> | undefined;
    onTouchStartCapture?: TouchEventHandler<Target> | undefined;
    onPointerOver?: PointerEventHandler<Target> | undefined;
    onPointerOverCapture?: PointerEventHandler<Target> | undefined;
    onPointerEnter?: PointerEventHandler<Target> | undefined;
    onPointerEnterCapture?: PointerEventHandler<Target> | undefined;
    onPointerDown?: PointerEventHandler<Target> | undefined;
    onPointerDownCapture?: PointerEventHandler<Target> | undefined;
    onPointerMove?: PointerEventHandler<Target> | undefined;
    onPointerMoveCapture?: PointerEventHandler<Target> | undefined;
    onPointerUp?: PointerEventHandler<Target> | undefined;
    onPointerUpCapture?: PointerEventHandler<Target> | undefined;
    onPointerCancel?: PointerEventHandler<Target> | undefined;
    onPointerCancelCapture?: PointerEventHandler<Target> | undefined;
    onPointerOut?: PointerEventHandler<Target> | undefined;
    onPointerOutCapture?: PointerEventHandler<Target> | undefined;
    onPointerLeave?: PointerEventHandler<Target> | undefined;
    onPointerLeaveCapture?: PointerEventHandler<Target> | undefined;
    onGotPointerCapture?: PointerEventHandler<Target> | undefined;
    onGotPointerCaptureCapture?: PointerEventHandler<Target> | undefined;
    onLostPointerCapture?: PointerEventHandler<Target> | undefined;
    onLostPointerCaptureCapture?: PointerEventHandler<Target> | undefined;
    onScroll?: UIEventHandler<Target> | undefined;
    onScrollEnd?: UIEventHandler<Target> | undefined;
    onScrollCapture?: UIEventHandler<Target> | undefined;
    onWheel?: WheelEventHandler<Target> | undefined;
    onWheelCapture?: WheelEventHandler<Target> | undefined;
    onAnimationStart?: AnimationEventHandler<Target> | undefined;
    onAnimationStartCapture?: AnimationEventHandler<Target> | undefined;
    onAnimationEnd?: AnimationEventHandler<Target> | undefined;
    onAnimationEndCapture?: AnimationEventHandler<Target> | undefined;
    onAnimationIteration?: AnimationEventHandler<Target> | undefined;
    onAnimationIterationCapture?: AnimationEventHandler<Target> | undefined;
    onTransitionCancel?: TransitionEventHandler<Target>;
    onTransitionCancelCapture?: TransitionEventHandler<Target>;
    onTransitionEnd?: TransitionEventHandler<Target>;
    onTransitionEndCapture?: TransitionEventHandler<Target>;
    onTransitionRun?: TransitionEventHandler<Target>;
    onTransitionRunCapture?: TransitionEventHandler<Target>;
    onTransitionStart?: TransitionEventHandler<Target>;
    onTransitionStartCapture?: TransitionEventHandler<Target>;
    onEnterPictureInPicture?: PictureInPictureEventHandler<Target>;
    onEnterPictureInPictureCapture?: PictureInPictureEventHandler<Target>;
    onLeavePictureInPicture?: PictureInPictureEventHandler<Target>;
    onLeavePictureInPictureCapture?: PictureInPictureEventHandler<Target>;
    onResize?: PictureInPictureEventHandler<Target>;
    onResizeCapture?: PictureInPictureEventHandler<Target>;
    onCommand?: CommandEventHandler<Target>;
  }
  export interface HTMLAttributes extends AriaAttributes, DOMAttributes {
    key?: Value<TKey | TKey[]>;
    style?: Value<CSSProperties | string>;
    dangerouslySetInnerHTML?: Value<{ __html: string }>;
    accessKey?: Value<string>;
    autoFocus?: Value<boolean>;
    disabled?: Value<boolean>;
    class?: Value<string>;
    className?: Value<string>;
    contentEditable?: Value<boolean | 'inherit'>;
    contextMenu?: Value<string>;
    dir?: Value<string>;
    draggable?: Value<boolean>;
    hidden?: Value<boolean>;
    id?: Value<string>;
    lang?: Value<string>;
    nonce?: Value<string>;
    placeholder?: Value<string>;
    slot?: Value<string>;
    spellCheck?: Value<boolean>;
    tabIndex?: Value<number>;
    title?: Value<string>;
    translate?: Value<'yes' | 'no'>;
    type?: Value<string>;
    name?: Value<string>;
    radioGroup?: Value<string | undefined>;
    role?: Value<AriaRole | undefined>;
    about?: Value<string | undefined>;
    content?: Value<string | undefined>;
    datatype?: Value<string | undefined>;
    inlist?: TAny;
    prefix?: Value<string | undefined>;
    property?: Value<string | undefined>;
    rel?: Value<string | undefined>;
    resource?: Value<string | undefined>;
    rev?: Value<string | undefined>;
    typeof?: Value<string | undefined>;
    vocab?: Value<string | undefined>;
    autoCapitalize?: Value<string | undefined>;
    autoCorrect?: Value<string | undefined>;
    autoSave?: Value<string | undefined>;
    color?: Value<string | undefined>;
    itemProp?: Value<string | undefined>;
    itemScope?: Value<boolean | undefined>;
    itemType?: Value<string | undefined>;
    itemID?: Value<string | undefined>;
    itemRef?: Value<string | undefined>;
    results?: Value<string | undefined>;
    security?: Value<string | undefined>;
    unselectable?: Value<'on' | 'off' | undefined>;
    inputMode?: Value<
      | 'none'
      | 'text'
      | 'tel'
      | 'url'
      | 'email'
      | 'numeric'
      | 'decimal'
      | 'search'
      | undefined
    >;
    is?: Value<string | undefined>;
    [k: string]: unknown;
  }
  type HTMLAttributeReferrerPolicy =
    | ''
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
  type HTMLAttributeAnchorTarget =
    | '_self'
    | '_blank'
    | '_parent'
    | '_top'
    | (string & EObject);
  export interface AnchorHTMLAttributes extends HTMLAttributes {
    download?: TAny;
    href?: Value<string | undefined>;
    hrefLang?: Value<string | undefined>;
    media?: Value<string | undefined>;
    ping?: Value<string | undefined>;
    target?: Value<HTMLAttributeAnchorTarget | undefined>;
    type?: Value<string | undefined>;
    referrerPolicy?: Value<HTMLAttributeReferrerPolicy | undefined>;
  }
  export interface AudioHTMLAttributes extends MediaHTMLAttributes {}
  export interface AreaHTMLAttributes extends HTMLAttributes {
    alt?: Value<string | undefined>;
    coords?: Value<string | undefined>;
    download?: TAny;
    href?: Value<string | undefined>;
    hrefLang?: Value<string | undefined>;
    media?: Value<string | undefined>;
    referrerPolicy?: Value<HTMLAttributeReferrerPolicy | undefined>;
    shape?: Value<string | undefined>;
    target?: Value<string | undefined>;
  }
  export interface BaseHTMLAttributes extends HTMLAttributes {
    href?: Value<string | undefined>;
    target?: Value<string | undefined>;
  }
  export interface BlockquoteHTMLAttributes extends HTMLAttributes {
    cite?: Value<string | undefined>;
  }
  export interface ButtonHTMLAttributes extends HTMLAttributes {
    disabled?: Value<boolean | undefined>;
    form?: Value<string | undefined>;
    formAction?: Value<string | EObject[keyof EObject] | undefined>;
    formEncType?: Value<string | undefined>;
    formMethod?: Value<string | undefined>;
    formNoValidate?: Value<boolean | undefined>;
    formTarget?: Value<string | undefined>;
    name?: Value<string | undefined>;
    type?: Value<'submit' | 'reset' | 'button' | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface CanvasHTMLAttributes extends HTMLAttributes {
    height?: Value<number | string | undefined>;
    width?: Value<number | string | undefined>;
  }
  export interface ColHTMLAttributes extends HTMLAttributes {
    span?: Value<number | undefined>;
    width?: Value<number | string | undefined>;
  }
  export interface ColgroupHTMLAttributes extends HTMLAttributes {
    span?: Value<number | undefined>;
  }
  export interface DataHTMLAttributes extends HTMLAttributes {
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface DetailsHTMLAttributes extends HTMLAttributes {
    open?: Value<boolean | undefined>;
  }
  export interface DelHTMLAttributes extends HTMLAttributes {
    cite?: Value<string | undefined>;
    dateTime?: Value<string | undefined>;
  }
  export interface DialogHTMLAttributes extends HTMLAttributes {
    open?: Value<boolean | undefined>;
  }
  export interface EmbedHTMLAttributes extends HTMLAttributes {
    height?: Value<number | string | undefined>;
    src?: Value<string | undefined>;
    type?: Value<string | undefined>;
    width?: Value<number | string | undefined>;
  }
  export interface FieldsetHTMLAttributes extends HTMLAttributes {
    disabled?: Value<boolean | undefined>;
    form?: Value<string | undefined>;
    name?: Value<string | undefined>;
  }
  export interface FormHTMLAttributes extends HTMLAttributes {
    acceptCharset?: Value<string | undefined>;
    action?: Value<string | undefined | EObject[keyof EObject]>;
    autoComplete?: Value<string | undefined>;
    encType?: Value<string | undefined>;
    method?: Value<string | undefined>;
    name?: Value<string | undefined>;
    noValidate?: Value<boolean | undefined>;
    target?: Value<string | undefined>;
  }
  export interface HtmlHTMLAttributes extends HTMLAttributes {
    manifest?: Value<string | undefined>;
  }
  export interface IframeHTMLAttributes extends HTMLAttributes {
    allow?: Value<string | undefined>;
    allowFullScreen?: Value<boolean | undefined>;
    allowTransparency?: Value<boolean | undefined>;
    /** @deprecated */
    frameBorder?: Value<number | string | undefined>;
    height?: Value<number | string | undefined>;
    loading?: Value<'eager' | 'lazy' | undefined>;
    /** @deprecated */
    marginHeight?: Value<number | undefined>;
    /** @deprecated */
    marginWidth?: Value<number | undefined>;
    name?: Value<string | undefined>;
    referrerPolicy?: Value<HTMLAttributeReferrerPolicy | undefined>;
    sandbox?: Value<string | undefined>;
    /** @deprecated */
    scrolling?: Value<string | undefined>;
    seamless?: Value<boolean | undefined>;
    src?: Value<string | undefined>;
    srcDoc?: Value<string | undefined>;
    width?: Value<number | string | undefined>;
  }
  type CrossOrigin = 'anonymous' | 'use-credentials' | '' | undefined;
  export interface ImgHTMLAttributes extends HTMLAttributes {
    alt?: Value<string | undefined>;
    crossOrigin?: Value<CrossOrigin>;
    decoding?: Value<'async' | 'auto' | 'sync' | undefined>;
    height?: Value<number | string | undefined>;
    loading?: Value<'eager' | 'lazy' | undefined>;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: Value<string | undefined>;
    src?: Value<string | undefined>;
    srcSet?: Value<string | undefined>;
    useMap?: Value<string | undefined>;
    width?: Value<number | string | undefined>;
  }
  export interface InsHTMLAttributes extends HTMLAttributes {
    cite?: Value<string | undefined>;
    dateTime?: Value<string | undefined>;
  }
  type HTMLInputTypeAttribute =
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
    | (string & EObject);
  export interface InputHTMLAttributes extends HTMLAttributes {
    accept?: Value<string | undefined>;
    alt?: Value<string | undefined>;
    autoComplete?: Value<string | undefined>;
    capture?: Value<boolean | 'user' | 'environment' | undefined>;
    checked?: Value<boolean | undefined>;
    disabled?: Value<boolean | undefined>;
    enterKeyHint?: Value<
      | 'enter'
      | 'done'
      | 'go'
      | 'next'
      | 'previous'
      | 'search'
      | 'send'
      | undefined
    >;
    form?: Value<string | undefined>;
    formAction?: Value<string | EObject[keyof EObject] | undefined>;
    formEncType?: Value<string | undefined>;
    formMethod?: Value<string | undefined>;
    formNoValidate?: Value<boolean | undefined>;
    formTarget?: Value<string | undefined>;
    height?: Value<number | string | undefined>;
    list?: Value<string | undefined>;
    max?: Value<number | string | undefined>;
    maxLength?: Value<number | undefined>;
    min?: Value<number | string | undefined>;
    minLength?: Value<number | undefined>;
    multiple?: Value<boolean | undefined>;
    name?: Value<string | undefined>;
    pattern?: Value<string | undefined>;
    placeholder?: Value<string | undefined>;
    readOnly?: Value<boolean | undefined>;
    required?: Value<boolean | undefined>;
    size?: Value<number | undefined>;
    src?: Value<string | undefined>;
    step?: Value<number | string | undefined>;
    type?: Value<HTMLInputTypeAttribute | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
    width?: Value<number | string | undefined>;
  }
  export interface KeygenHTMLAttributes extends HTMLAttributes {
    challenge?: Value<string | undefined>;
    disabled?: Value<boolean | undefined>;
    form?: Value<string | undefined>;
    keyType?: Value<string | undefined>;
    keyParams?: Value<string | undefined>;
    name?: Value<string | undefined>;
  }
  export interface LabelHTMLAttributes extends HTMLAttributes {
    form?: Value<string | undefined>;
    htmlFor?: Value<string | undefined>;
    for?: Value<string | undefined>;
  }
  export interface LiHTMLAttributes extends HTMLAttributes {
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface LinkHTMLAttributes extends HTMLAttributes {
    as?: Value<string | undefined>;
    crossOrigin?: Value<CrossOrigin>;
    fetchPriority?: Value<'high' | 'low' | 'auto'>;
    href?: Value<string | undefined>;
    hrefLang?: Value<string | undefined>;
    integrity?: Value<string | undefined>;
    media?: Value<string | undefined>;
    imageSrcSet?: Value<string | undefined>;
    imageSizes?: Value<string | undefined>;
    referrerPolicy?: Value<HTMLAttributeReferrerPolicy | undefined>;
    sizes?: Value<string | undefined>;
    type?: Value<string | undefined>;
    charSet?: Value<string | undefined>;
  }
  export interface MapHTMLAttributes extends HTMLAttributes {
    name?: Value<string | undefined>;
  }
  export interface MenuHTMLAttributes extends HTMLAttributes {
    type?: Value<string | undefined>;
  }
  export interface MediaHTMLAttributes extends HTMLAttributes {
    autoPlay?: Value<boolean | undefined>;
    controls?: Value<boolean | undefined>;
    controlsList?: Value<string | undefined>;
    crossOrigin?: Value<CrossOrigin>;
    loop?: Value<boolean | undefined>;
    mediaGroup?: Value<string | undefined>;
    muted?: Value<boolean | undefined>;
    playsInline?: Value<boolean | undefined>;
    preload?: Value<string | undefined>;
    src?: Value<string | undefined>;
  }
  export interface MetaHTMLAttributes extends HTMLAttributes {
    charSet?: Value<string | undefined>;
    httpEquiv?: Value<string | undefined>;
    name?: Value<string | undefined>;
    media?: Value<string | undefined>;
    content?: Value<string | undefined>;
  }
  export interface MeterHTMLAttributes extends HTMLAttributes {
    form?: Value<string | undefined>;
    high?: Value<number | undefined>;
    low?: Value<number | undefined>;
    max?: Value<number | string | undefined>;
    min?: Value<number | string | undefined>;
    optimum?: Value<number | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface QuoteHTMLAttributes extends HTMLAttributes {
    cite?: Value<string | undefined>;
  }
  export interface ObjectHTMLAttributes extends HTMLAttributes {
    classID?: Value<string | undefined>;
    data?: Value<string | undefined>;
    form?: Value<string | undefined>;
    height?: Value<number | string | undefined>;
    name?: Value<string | undefined>;
    type?: Value<string | undefined>;
    useMap?: Value<string | undefined>;
    width?: Value<number | string | undefined>;
    wmode?: Value<string | undefined>;
  }
  export interface OlHTMLAttributes extends HTMLAttributes {
    reversed?: Value<boolean | undefined>;
    start?: Value<number | undefined>;
    type?: Value<'1' | 'a' | 'A' | 'i' | 'I' | undefined>;
  }
  export interface OptgroupHTMLAttributes extends HTMLAttributes {
    disabled?: Value<boolean | undefined>;
    label?: Value<string | undefined>;
  }
  export interface OptionHTMLAttributes extends HTMLAttributes {
    disabled?: Value<boolean | undefined>;
    label?: Value<string | undefined>;
    selected?: Value<boolean | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface OutputHTMLAttributes extends HTMLAttributes {
    form?: Value<string | undefined>;
    htmlFor?: Value<string | undefined>;
    for?: Value<string | undefined>;
    name?: Value<string | undefined>;
  }
  export interface ParamHTMLAttributes extends HTMLAttributes {
    name?: Value<string | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface ProgressHTMLAttributes extends HTMLAttributes {
    max?: Value<number | string | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface SlotHTMLAttributes extends HTMLAttributes {
    name?: Value<string | undefined>;
  }
  export interface ScriptHTMLAttributes extends HTMLAttributes {
    async?: Value<boolean | undefined>;
    /** @deprecated */
    charSet?: Value<string | undefined>;
    crossOrigin?: CrossOrigin;
    defer?: Value<boolean | undefined>;
    integrity?: Value<string | undefined>;
    noModule?: Value<boolean | undefined>;
    referrerPolicy?: Value<HTMLAttributeReferrerPolicy | undefined>;
    src?: Value<string | undefined>;
    type?: Value<string | undefined>;
  }
  export interface SelectHTMLAttributes extends HTMLAttributes {
    autoComplete?: Value<string | undefined>;
    disabled?: Value<boolean | undefined>;
    form?: Value<string | undefined>;
    multiple?: Value<boolean | undefined>;
    name?: Value<string | undefined>;
    required?: Value<boolean | undefined>;
    size?: Value<number | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
  }
  export interface SourceHTMLAttributes extends HTMLAttributes {
    height?: Value<number | string | undefined>;
    media?: Value<string | undefined>;
    sizes?: Value<string | undefined>;
    src?: Value<string | undefined>;
    srcSet?: Value<string | undefined>;
    type?: Value<string | undefined>;
    width?: Value<number | string | undefined>;
  }
  export interface StyleHTMLAttributes extends HTMLAttributes {
    media?: Value<string | undefined>;
    scoped?: Value<boolean | undefined>;
    type?: Value<string | undefined>;
  }
  export interface TableHTMLAttributes extends HTMLAttributes {
    align?: Value<'left' | 'center' | 'right' | undefined>;
    bgcolor?: Value<string | undefined>;
    border?: Value<number | undefined>;
    cellPadding?: Value<number | string | undefined>;
    cellSpacing?: Value<number | string | undefined>;
    frame?: Value<boolean | undefined>;
    rules?: Value<'none' | 'groups' | 'rows' | 'columns' | 'all' | undefined>;
    summary?: Value<string | undefined>;
    width?: Value<number | string | undefined>;
  }
  export interface TextareaHTMLAttributes extends HTMLAttributes {
    autoComplete?: Value<string | undefined>;
    cols?: Value<number | undefined>;
    dirName?: Value<string | undefined>;
    disabled?: Value<boolean | undefined>;
    form?: Value<string | undefined>;
    maxLength?: Value<number | undefined>;
    minLength?: Value<number | undefined>;
    name?: Value<string | undefined>;
    placeholder?: Value<string | undefined>;
    readOnly?: Value<boolean | undefined>;
    required?: Value<boolean | undefined>;
    rows?: Value<number | undefined>;
    value?: Value<string | readonly string[] | number | undefined>;
    wrap?: Value<string | undefined>;
  }
  export interface TdHTMLAttributes extends HTMLAttributes {
    align?: Value<'left' | 'center' | 'right' | 'justify' | 'char' | undefined>;
    colSpan?: Value<number | undefined>;
    headers?: Value<string | undefined>;
    rowSpan?: Value<number | undefined>;
    scope?: Value<string | undefined>;
    abbr?: Value<string | undefined>;
    height?: Value<number | string | undefined>;
    width?: Value<number | string | undefined>;
    valign?: Value<'top' | 'middle' | 'bottom' | 'baseline' | undefined>;
  }
  export interface ThHTMLAttributes extends HTMLAttributes {
    align?: Value<'left' | 'center' | 'right' | 'justify' | 'char' | undefined>;
    colSpan?: Value<number | undefined>;
    headers?: Value<string | undefined>;
    rowSpan?: Value<number | undefined>;
    scope?: Value<string | undefined>;
    abbr?: Value<string | undefined>;
  }
  export interface TimeHTMLAttributes extends HTMLAttributes {
    dateTime?: Value<string | undefined>;
  }
  export interface TrackHTMLAttributes extends HTMLAttributes {
    default?: Value<boolean | undefined>;
    kind?: Value<string | undefined>;
    label?: Value<string | undefined>;
    src?: Value<string | undefined>;
    srcLang?: Value<string | undefined>;
  }
  export interface VideoHTMLAttributes extends MediaHTMLAttributes {
    height?: Value<number | string | undefined>;
    playsInline?: Value<boolean | undefined>;
    poster?: Value<string | undefined>;
    width?: Value<number | string | undefined>;
    disablePictureInPicture?: Value<boolean | undefined>;
    disableRemotePlayback?: Value<boolean | undefined>;
  }
  export interface WebViewHTMLAttributes extends HTMLAttributes {
    allowFullScreen?: Value<boolean | undefined>;
    allowpopups?: Value<boolean | undefined>;
    autosize?: Value<boolean | undefined>;
    blinkfeatures?: Value<string | undefined>;
    disableblinkfeatures?: Value<string | undefined>;
    disableguestresize?: Value<boolean | undefined>;
    disablewebsecurity?: Value<boolean | undefined>;
    guestinstance?: Value<string | undefined>;
    httpreferrer?: Value<string | undefined>;
    nodeintegration?: Value<boolean | undefined>;
    partition?: Value<string | undefined>;
    plugins?: Value<boolean | undefined>;
    preload?: Value<string | undefined>;
    src?: Value<string | undefined>;
    useragent?: Value<string | undefined>;
    webpreferences?: Value<string | undefined>;
  }
  export interface IntrinsicElements {
    a: AnchorHTMLAttributes;
    abbr: HTMLAttributes;
    address: HTMLAttributes;
    area: AreaHTMLAttributes;
    article: HTMLAttributes;
    aside: HTMLAttributes;
    audio: AudioHTMLAttributes;
    b: HTMLAttributes;
    base: BaseHTMLAttributes;
    bdi: HTMLAttributes;
    bdo: HTMLAttributes;
    big: HTMLAttributes;
    blockquote: BlockquoteHTMLAttributes;
    body: HTMLAttributes;
    br: HTMLAttributes;
    button: ButtonHTMLAttributes;
    canvas: CanvasHTMLAttributes;
    caption: HTMLAttributes;
    center: HTMLAttributes;
    cite: HTMLAttributes;
    code: HTMLAttributes;
    col: ColHTMLAttributes;
    colgroup: ColgroupHTMLAttributes;
    data: DataHTMLAttributes;
    datalist: HTMLAttributes;
    dd: HTMLAttributes;
    del: DelHTMLAttributes;
    details: DetailsHTMLAttributes;
    dfn: HTMLAttributes;
    dialog: DialogHTMLAttributes;
    div: HTMLAttributes;
    dl: HTMLAttributes;
    dt: HTMLAttributes;
    em: HTMLAttributes;
    embed: EmbedHTMLAttributes;
    fieldset: FieldsetHTMLAttributes;
    figcaption: HTMLAttributes;
    figure: HTMLAttributes;
    footer: HTMLAttributes;
    form: FormHTMLAttributes;
    h1: HTMLAttributes;
    h2: HTMLAttributes;
    h3: HTMLAttributes;
    h4: HTMLAttributes;
    h5: HTMLAttributes;
    h6: HTMLAttributes;
    head: HTMLAttributes;
    header: HTMLAttributes;
    hgroup: HTMLAttributes;
    hr: HTMLAttributes;
    html: HtmlHTMLAttributes;
    i: HTMLAttributes;
    iframe: IframeHTMLAttributes;
    img: ImgHTMLAttributes;
    input: InputHTMLAttributes;
    ins: InsHTMLAttributes;
    kbd: HTMLAttributes;
    keygen: KeygenHTMLAttributes;
    label: LabelHTMLAttributes;
    legend: HTMLAttributes;
    li: LiHTMLAttributes;
    link: LinkHTMLAttributes;
    main: HTMLAttributes;
    map: MapHTMLAttributes;
    mark: HTMLAttributes;
    menu: MenuHTMLAttributes;
    menuitem: HTMLAttributes;
    meta: MetaHTMLAttributes;
    meter: MeterHTMLAttributes;
    nav: HTMLAttributes;
    noindex: HTMLAttributes;
    noscript: HTMLAttributes;
    object: ObjectHTMLAttributes;
    ol: OlHTMLAttributes;
    optgroup: OptgroupHTMLAttributes;
    option: OptionHTMLAttributes;
    output: OutputHTMLAttributes;
    p: HTMLAttributes;
    param: ParamHTMLAttributes;
    picture: HTMLAttributes;
    pre: HTMLAttributes;
    progress: ProgressHTMLAttributes;
    q: QuoteHTMLAttributes;
    rp: HTMLAttributes;
    rt: HTMLAttributes;
    ruby: HTMLAttributes;
    s: HTMLAttributes;
    samp: HTMLAttributes;
    search: HTMLAttributes;
    slot: SlotHTMLAttributes;
    script: ScriptHTMLAttributes;
    section: HTMLAttributes;
    select: SelectHTMLAttributes;
    small: HTMLAttributes;
    source: SourceHTMLAttributes;
    span: HTMLAttributes;
    strong: HTMLAttributes;
    style: StyleHTMLAttributes;
    sub: HTMLAttributes;
    summary: HTMLAttributes;
    sup: HTMLAttributes;
    table: TableHTMLAttributes;
    template: HTMLAttributes;
    tbody: HTMLAttributes;
    td: TdHTMLAttributes;
    textarea: TextareaHTMLAttributes;
    tfoot: HTMLAttributes;
    th: ThHTMLAttributes;
    thead: HTMLAttributes;
    time: TimeHTMLAttributes;
    title: HTMLAttributes;
    tr: HTMLAttributes;
    track: TrackHTMLAttributes;
    u: HTMLAttributes;
    ul: HTMLAttributes;
    var: HTMLAttributes;
    video: VideoHTMLAttributes;
    wbr: HTMLAttributes;
    webview: WebViewHTMLAttributes;
  }
  export {};
}
