import { ReactElement } from "react";
import { FlatListProps } from "react-native";
import { ContainerSettings } from "../../providers/ContentCardContainerProvider";
import { ContentTemplate } from "../../types/Templates";
import { ContentViewProps } from "../ContentCardView/ContentCardView";
export interface ContentCardContainerProps<T> extends Partial<FlatListProps<T>> {
    LoadingComponent?: ReactElement | null;
    ErrorComponent?: ReactElement | null;
    FallbackComponent?: ReactElement | null;
    EmptyComponent?: ReactElement | null;
    surface: string;
    settings: ContainerSettings | null;
    isLoading?: boolean;
    error?: boolean;
    CardProps?: Partial<ContentViewProps>;
    refetch?: () => Promise<void>;
}
export declare function ContentCardContainer<T extends ContentTemplate>({ LoadingComponent, ErrorComponent, FallbackComponent, surface, settings, isLoading, error, ...props }: ContentCardContainerProps<T>): React.ReactElement;
//# sourceMappingURL=ContentCardContainer.d.ts.map