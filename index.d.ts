export default (params: {
  antDir: string;
  stylesDir: string;
  varFile: string;
  mainLessFile: string;
  outputFilePath: string;
}) => (nextConfig: Object) => Object;
export var changeTheme: (theme: 'default' | 'dark' | { [key: string]: string }) => void;
