declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.css" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}