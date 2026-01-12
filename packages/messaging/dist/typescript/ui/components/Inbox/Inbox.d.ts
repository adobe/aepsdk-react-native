import { ReactElement } from "react";
import { FlatListProps } from "react-native";
import { InboxSettings } from "../../providers/InboxProvider";
import { ContentTemplate } from "../../types/Templates";
import { ContentViewProps } from "../ContentCardView/ContentCardView";
export interface InboxProps<T> extends Partial<FlatListProps<T>> {
    LoadingComponent?: ReactElement | null;
    ErrorComponent?: ReactElement | null;
    FallbackComponent?: ReactElement | null;
    EmptyComponent?: ReactElement | null;
    surface: string;
    settings: InboxSettings | null;
    isLoading?: boolean;
    error?: boolean;
    CardProps?: Partial<ContentViewProps>;
}
export declare function Inbox<T extends ContentTemplate>({ LoadingComponent, ErrorComponent, FallbackComponent, surface, settings, isLoading, error, ...props }: InboxProps<T>): React.ReactElement;
//# sourceMappingURL=Inbox.d.ts.map