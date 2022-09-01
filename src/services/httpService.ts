class HttpService {

    private constructor(private baseUrl = '', private defaultHeaders: Record<string, string> = {}) { }

    private static httpService: HttpService;

    static getInstance(baseUrl: string, defaultHeaders: Record<string, string> = {}): HttpService {
        if (HttpService.httpService) {
            return HttpService.httpService;
        }
         HttpService.httpService = new HttpService(baseUrl, defaultHeaders);
        
         return HttpService.httpService
    }
    async get<T>(url: string, { qp, config }: { qp?: Record<string, string>, config?: HttpConfig }) {

        const headers = config?.headers;
        const handledQP = qp !=null ? '?' + new URLSearchParams(qp) : '';
        try {
            const res = await fetch(this.baseUrl + url + handledQP, {
                method: 'GET',
                signal: config?.signal,
                headers: {
                    ...this.defaultHeaders,
                    ...headers,

                }
            });
            return await res.json() as T;
        } catch (error) {
            throw error;
        }

    }
}

interface HttpConfig {
    headers?: Record<string, string>
    signal?: AbortSignal;
}


export const http = HttpService.getInstance('https://api.github.com/search', {
    'Authorization': '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',
    'Content-Type': 'application/json',
});
