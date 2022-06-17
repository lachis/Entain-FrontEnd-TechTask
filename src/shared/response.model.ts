export interface NextToGoResponse {
    status: number;
    data: NextToGoDataResponse;
}

export interface NextToGoDataResponse {
    next_to_go_ids: string[];
    race_summaries: any; 
}

