#!/usr/bin/env node

/* IMPORT */

import config from './config';
import * as Reporters from './reporters';

/* RSSA */

const reporter = config.report.active;

if ( !Reporters.hasOwnProperty ( reporter ) ) throw new Error ( `Unsupported reporter: ${reporter}` );

( new Reporters[reporter] ).run ();
