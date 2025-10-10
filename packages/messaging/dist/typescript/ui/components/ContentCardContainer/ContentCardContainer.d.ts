import { ReactElement } from "react";
import { FlatListProps } from "react-native";
import { ContentTemplate } from "../../types/Templates";
import { ContentViewProps } from "../ContentCardView/ContentCardView";
export interface ContentCardContainerProps<T> extends Partial<FlatListProps<T>> {
    LoadingComponent?: ReactElement | null;
    ErrorComponent?: ReactElement | null;
    FallbackComponent?: ReactElement | null;
    EmptyComponent?: ReactElement | null;
    surface: string;
    CardProps?: Partial<ContentViewProps>;
}
export declare function ContentCardContainer<T extends ContentTemplate>({ LoadingComponent, ErrorComponent, FallbackComponent, surface, ...props }: ContentCardContainerProps<T>): React.ReactElement;
//# sourceMappingURL=ContentCardContainer.d.ts.map