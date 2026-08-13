export interface ComponentParam {
    name: string;
    required: boolean;
}

export interface Component {
    name: string;
    content: string;
    params: ComponentParam[];
}
