/// <reference types="react" />
import { FlatListProps } from "react-native";
export interface ContentCardContainerProps<T> extends FlatListProps<T> {
    LoadingComponent?: React.ReactNode;
    ErrorComponent?: React.ReactNode;
    FallbackComponent?: React.ReactNode;
    surface: string;
}
export declare function ContentCardContainer<T>({ LoadingComponent, ErrorComponent, FallbackComponent, surface, ...props }: ContentCardContainerProps<T>): React.ReactElement;
//# sourceMappingURL=ContentCardContainer.d.ts.map