import { Request, Response, NextFunction } from "express";

export interface IResponse {
  success: boolean;
  data: any;
  accessToken?: string;
}

// type aliases
export type Req = Request;
export type Res = Response;
export type Next = NextFunction;
