// Makes React available as a global namespace so that generated Next.js types
// in .next/types/ (which use React.ReactNode without importing) resolve correctly.
// This is a script file (no import/export) so declare global works directly.
declare namespace React {
  type ReactNode = import("react").ReactNode;
  type FC<P = object> = import("react").FC<P>;
  type CSSProperties = import("react").CSSProperties;
  type ElementType<P = any> = import("react").ElementType<P>;
  type ComponentProps<
    T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
  > = import("react").ComponentProps<T>;
  type JSXElementConstructor<P> = import("react").JSXElementConstructor<P>;
  type Key = import("react").Key;
  type Ref<T> = import("react").Ref<T>;
  type RefObject<T> = import("react").RefObject<T>;
  type MutableRefObject<T> = import("react").MutableRefObject<T>;
  type HTMLAttributes<T> = import("react").HTMLAttributes<T>;
  type MouseEvent<
    T = Element,
    E = globalThis.MouseEvent,
  > = import("react").MouseEvent<T, E>;
  type ChangeEvent<T = Element> = import("react").ChangeEvent<T>;
  type FormEvent<T = Element> = import("react").FormEvent<T>;
  type KeyboardEvent<T = Element> = import("react").KeyboardEvent<T>;
  type Dispatch<A> = import("react").Dispatch<A>;
  type SetStateAction<S> = import("react").SetStateAction<S>;
  type Context<T> = import("react").Context<T>;
  type Provider<T> = import("react").Provider<T>;
  type Consumer<T> = import("react").Consumer<T>;
  type Reducer<S, A> = import("react").Reducer<S, A>;
  type ReducerState<R extends Reducer<any, any>> =
    import("react").ReducerState<R>;
  type ReducerAction<R extends Reducer<any, any>> =
    import("react").ReducerAction<R>;
  type Effect = import("react").EffectCallback;
  type DependencyList = import("react").DependencyList;
}
