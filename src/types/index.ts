// types/index.ts
import type { Server as HTTPServer } from "http";
import type { Server as IOServer } from "socket.io";
import type { Socket as NetSocket } from "net";
import type { NextApiResponse } from "next";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export interface Neo4jUser {
  applicationId: string;
  firstname: string;
  lastname?: string;
  email: string;
}
