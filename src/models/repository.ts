
export class Repository {
    constructor(
        public id: number,
        public name: string,
        public owner: { login: string },
        public forks_count: number,
        public open_issues_count: number,
        public stargazers_count: number,
        public size: number
    ) { }

}

