import { TableType } from 'typeorm/metadata/types/TableTypes'
import { EntitySchemaUniqueOptions } from 'typeorm/entity-schema/EntitySchemaUniqueOptions'
import { EntitySchemaCheckOptions } from 'typeorm/entity-schema/EntitySchemaCheckOptions'
import { EntitySchemaExclusionOptions } from 'typeorm/entity-schema/EntitySchemaExclusionOptions'
import { EntitySchemaColumnOptions, EntitySchemaIndexOptions, EntitySchemaRelationOptions, OrderByCondition, Repository } from 'typeorm'
import util from "util"
import child_process from "child_process"
import worker_threads from "worker_threads"
import os from "os"
import v8 from "v8"
import vm from "vm"
import path from "path"
import url from "url"
import string_decoder from "string_decoder"
import querystring from "querystring"
import assert from "assert"
import stream from "stream"
import fs from "fs"
import crypto from "crypto"
import zlib from "zlib"
import readline from "readline"
import perf_hooks from "perf_hooks"
import async_hooks from "async_hooks"
import timers from "timers"
import events from "events"
import dns from "dns"
import net from "net"
import tls from "tls"
import http from "http"
import https from "https"
import http2 from "http2"
import dgram from "dgram"
import fastify from "fastify"
import lodash from "lodash"
import pg from "pg"
import typeorm from "typeorm"
declare global {

    const node: {
        process: typeof process
        util: typeof util
        child_process: typeof child_process
        worker_threads: typeof worker_threads
        os: typeof os
        v8: typeof v8
        vm: typeof vm
        path: typeof path
        url: typeof url
        string_decoder: typeof string_decoder
        querystring: typeof querystring
        assert: typeof assert
        stream: typeof stream
        fs: typeof fs
        crypto: typeof crypto
        zlib: typeof zlib
        readline: typeof readline
        perf_hooks: typeof perf_hooks
        async_hooks: typeof async_hooks
        timers: typeof timers
        events: typeof events
        dns: typeof dns
        net: typeof net
        tls: typeof tls
        http: typeof http
        https: typeof https
        http2: typeof http2
        dgram: typeof dgram
    }
    const npm: {
        fastify: typeof fastify
        lodash: typeof lodash
        pg: typeof pg
        typeorm: typeof typeorm
    }
    const api: {
        user: { get: (...args: any) => any, post: (...args: any) => any },
        app: { get: (...args: any) => any, post: (...args: any) => any },
        db: { get: (...args: any) => any, post: (...args: any) => any },
        post: { get: (...args: any) => any, post: (...args: any) => any }
}
    const services: {
        test: {
                test: {
                        test: { get: (...args: any) => any, post: (...args: any) => any },
                        test2: { get: (...args: any) => any, post: (...args: any) => any }
                }
        },
        test2: { get: (...args: any) => any, post: (...args: any) => any }
}
    const config : {
  "port": 8888
}
    class EntitySchema<T> {
        extends?: string;
        target?: Function;
        name: string;
        tableName?: string;
        database?: string;
        schema?: string;
        type?: TableType;
        orderBy?: OrderByCondition;
        columns: {
            [P: string]: EntitySchemaColumnOptions;
        };
        relations?: {
            [P: string]: EntitySchemaRelationOptions;
        };
        indices?: EntitySchemaIndexOptions[];
        uniques?: EntitySchemaUniqueOptions[];
        checks?: EntitySchemaCheckOptions[];
        exclusions?: EntitySchemaExclusionOptions[];
        synchronize?: boolean;
    }
interface abstractInterface {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    [P: string]: any,
}
interface post  extends abstractInterface {
    title: string;
    content: string;
    user_id: string;
    user: user;
}
interface user  extends abstractInterface {
    name: string,
    surname: string;
    posts: post;
}

const db: {
    posts: Repository<post>
    users: Repository<user>
}
}