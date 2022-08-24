import { http } from "./httpService";
import { ApiResponse } from "../models/response";
import { User } from "../models/user";
import { Repository } from "../models/repository";
export class GithubService {

   static async getUsers(q: string, signal: AbortSignal, page: number): Promise<ApiResponse<User>> {
     try {
      const res: any = await http.get('/users', {
         qp: {
            q,
            page: page.toString()
         },
         config: {
            signal
         }
      });
      return res;
     } catch (error) {
      throw error;
     }

   }

   static async getRepos(q: string, signal: AbortSignal, page: number): Promise<ApiResponse<Repository>> {
    try {
      const res: any = await http.get('/repositories', {
         qp: {
            q,
            page: page.toString()
         },
         config: {
            signal
         }
      });

      return res;
    } catch (error) {
      throw error;
    }

   }

}