declare module "*.json" {
    const value: {
        v: string;
        fr: number;
        ip: number;
        op: number;
        w: number;
        h: number;
        nm: string;
        ddd: number;
        assets: any[];
        layers: any[];
    };
    export default value;
}

declare interface MatchResult {
    sailor1: string;
    sailor2: string;
}