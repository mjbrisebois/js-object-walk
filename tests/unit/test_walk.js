import path				from 'path';
import logger				from '@whi/stdlog';
import { expect }			from 'chai';
import { logging, DELETE, bindNative }	from '../../lib/index.js';

bindNative();

const log					= logger(path.basename( import.meta.url ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

if ( process.env.LOG_LEVEL )
    logging();


function createInput () {
    return [{
	"fruit": {
	    "oranges": 10,
	    "bananas": 4,
	    "apples": 11,
	},
	"candy": [
	    99,
	    33,
	    66,
	    {
		"type": "Tank",
		"name": "Boomer",
		"bytes": new Uint8Array([1,2,3,4]),
	    }
	],
    }];
}

function basic_tests () {
    let input				= createInput();

    it("should collect all keys", async () => {
	let keys			= [];
	let json			= Object.walk( input, function (key, value) {
	    if ( typeof key === "string" )
		keys.push( key );
	    return value;
	});

	expect( keys			).to.deep.equal([ "fruit", "oranges", "bananas", "apples", "candy", "type", "name", "bytes", "0", "1", "2", "3" ]);
    });

    it("should replace Uint8Array", async () => {
	let keys			= [];
	let json			= Object.walk( input, function (key, value) {
	    log.info("Handling key/value: %s => %s", key, typeof value );
	    if ( typeof key === "string" )
		keys.push( key );

	    if ( value instanceof Uint8Array ) {
		return {
		    "type": "Uint8Array",
		    "data": [].slice.call(value),
		};
	    }

	    return value;
	});

	expect( keys			).to.deep.equal([ "fruit", "oranges", "bananas", "apples", "candy", "type", "name", "bytes", "type", "data" ]);
    });

    it("should replace base", async () => {
	let text			= Object.walk( Buffer.from("Hello"), function (key, value) {
	    let hexstr			= value.toString('hex').match(/.{2}/g).join(" ");
	    return `<Buffer ${hexstr}>`;
	});

	expect( text			).to.equal("<Buffer 48 65 6c 6c 6f>");
    });

    it("should collect all paths", async () => {
	let paths			= [];
	let json			= Object.walk( input, function (key, value, path) {
	    paths.push( path.join(".") );
	    return value;
	});

	expect( paths			).to.have.length( 20 );
	expect( paths.pop()		).to.equal("0.candy.3.bytes.data.3");
    });

    it("should remove ArrayBuffer views", async () => {
	input				= createInput();
	let result			= Object.walk( input, function (key, value) {
	    return ArrayBuffer.isView( value ) ? DELETE : value;
	});

	expect( JSON.stringify(result)	).to.equal(`[{"fruit":{"oranges":10,"bananas":4,"apples":11},"candy":[99,33,66,{"type":"Tank","name":"Boomer"}]}]`);
    });

    it("should do nothing on an undefined value", async () => {
	let input			= {
	    "something": undefined,
	};
	let result			= Object.walk( input, function (key, value) {
	    return value;
	});

	expect( JSON.stringify(result)	).to.equal(`{}`);
    });
}

describe("Debug", () => {

    describe("Basic", basic_tests );

});
