import { Database } from "metasql"
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
import axios from "axios"
import bcrypt from "bcrypt"
import concurrently from "concurrently"
import cors from "cors"
import express from "express"
import fastify from "fastify"
import funthreads from "funthreads"
import metasql from "metasql"
import morgan from "morgan"
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
        axios: typeof axios
        bcrypt: typeof bcrypt
        concurrently: typeof concurrently
        cors: typeof cors
        express: typeof express
        fastify: typeof fastify
        funthreads: typeof funthreads
        metasql: typeof metasql
        morgan: typeof morgan
    }
    const api: {
        user: {
                getCity: { get: Function, post: Function },
                getProduct: { get: Function, post: Function }
        },
        app: { get: Function, post: Function },
        db: { get: Function, post: Function }
}
    const services: {
        test: {
                test: {
                        test: { get: Function, post: Function },
                        test2: { get: Function, post: Function }
                }
        }
}
    const config : {
  "db": {
    "database": "bikesdb",
    "password": "hhs13516",
    "port": 5432,
    "host": "127.0.0.1",
    "user": "postgres",
    "logger": {}
  },
  "port": 8888,
  "backURL": "127.0.0.1:8888"
}
    const db: Database
    
}