declare module "expo-router" {
  export const Link: typeof import("expo-router/build/link/Link").Link;
  export const router: typeof import("expo-router/build/imperative-api").router;
  export const Stack: (
    props: {
      children?: import("react").ReactNode;
      screenOptions?: object;
    },
  ) => import("react").JSX.Element;
}
