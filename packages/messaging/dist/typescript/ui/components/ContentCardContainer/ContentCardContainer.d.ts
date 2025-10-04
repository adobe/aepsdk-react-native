import { FlatListProps } from "react-native";
import { ReactElement } from "react";
export interface ContentCardContainerProps<T> extends FlatListProps<T> {
    LoadingComponent?: ReactElement | null;
    ErrorComponent?: ReactElement | null;
    FallbackComponent?: ReactElement | null;
    EmptyComponent?: ReactElement | null;
    surface: string;
}
export declare function ContentCardContainer<T>({ LoadingComponent, ErrorComponent, FallbackComponent, surface, ...props }: ContentCardContainerProps<T>): React.ReactElement;
//# sourceMappingURL=ContentCardContainer.d.ts.map