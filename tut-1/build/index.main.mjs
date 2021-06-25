// Automatically generated with Reach 0.1.2
/* eslint-disable */
export const _version = '0.1.2';


export function getExports(s) {
  const stdlib = s.reachStdlib;
  return {
    };
  };

export function _getViews(s, viewlib) {
  const stdlib = s.reachStdlib;
  
  return {
    infos: {
      },
    views: {
      }
    };
  
  };

export function _getMaps(s) {
  const stdlib = s.reachStdlib;
  const ctc0 = stdlib.T_Tuple([]);
  return {
    mapDataTy: ctc0
    };
  };

export async function Alice(ctc, interact) {
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_Bytes(stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 30));
  const ctc1 = stdlib.T_Address;
  const ctc2 = stdlib.T_Bool;
  const ctc3 = stdlib.T_UInt;
  const ctc4 = stdlib.T_Tuple([ctc3]);
  const ctc5 = stdlib.T_Tuple([ctc3, ctc3]);
  
  
  const v19 = await ctc.creationTime();
  const v21 = ctc.selfAddress('Alice', false, stdlib.checkedBigNumberify('./index.rsh:22:13:application', stdlib.UInt_max, 20));
  const v23 = stdlib.protect(ctc0, await interact.createStream(), {
    at: './index.rsh:25:60:application',
    fs: ['at ./index.rsh:22:13:application call to [unknown function] (defined at: ./index.rsh:22:17:function exp)'],
    msg: 'createStream',
    who: 'Alice'
    });
  
  const txn1 = await (ctc.sendrecv(1, 2, stdlib.checkedBigNumberify('./index.rsh:30:9:dot', stdlib.UInt_max, 0), [ctc3, ctc0, ctc1], [v19, v23, v21], [stdlib.checkedBigNumberify('./index.rsh:decimal', stdlib.UInt_max, 0), []], [ctc0, ctc1], true, true, false, (async (txn1) => {
    const sim_r = { txns: [], mapRefs: [], mapsPrev: [], mapsNext: [] };
    
    sim_r.prevSt = stdlib.digest(ctc5, [stdlib.checkedBigNumberify('./index.rsh:30:9:dot', stdlib.UInt_max, 0), v19]);
    sim_r.prevSt_noPrevTime = stdlib.digest(ctc4, [stdlib.checkedBigNumberify('./index.rsh:30:9:dot', stdlib.UInt_max, 0)]);
    const [v25, v26] = txn1.data;
    const v28 = txn1.time;
    const v24 = txn1.from;
    
    sim_r.txns.push({
      amt: stdlib.checkedBigNumberify('./index.rsh:decimal', stdlib.UInt_max, 0),
      kind: 'to',
      tok: undefined
      });
    sim_r.nextSt = stdlib.digest(ctc5, [stdlib.checkedBigNumberify('./index.rsh:31:15:after expr stmt semicolon', stdlib.UInt_max, 1), v28]);
    sim_r.nextSt_noTime = stdlib.digest(ctc4, [stdlib.checkedBigNumberify('./index.rsh:31:15:after expr stmt semicolon', stdlib.UInt_max, 1)]);
    sim_r.view = [ctc4, [stdlib.checkedBigNumberify('./index.rsh:31:15:after expr stmt semicolon', stdlib.UInt_max, 0)]];
    sim_r.isHalt = false;
    
    return sim_r;
    })));
  const [v25, v26] = txn1.data;
  const v28 = txn1.time;
  const v24 = txn1.from;
  ;
  const txn2 = await (ctc.recv(2, 1, [ctc2], false, false));
  const [v34] = txn2.data;
  const v36 = txn2.time;
  const v33 = txn2.from;
  ;
  return;
  
  
  };
export async function Bob(ctc, interact) {
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_Bytes(stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 30));
  const ctc1 = stdlib.T_Address;
  const ctc2 = stdlib.T_Bool;
  const ctc3 = stdlib.T_Tuple([]);
  const ctc4 = stdlib.T_UInt;
  const ctc5 = stdlib.T_Tuple([ctc4, ctc4]);
  const ctc6 = stdlib.T_Tuple([ctc4]);
  
  
  const v19 = await ctc.creationTime();
  const txn1 = await (ctc.recv(1, 2, [ctc0, ctc1], false, false));
  const [v25, v26] = txn1.data;
  const v28 = txn1.time;
  const v24 = txn1.from;
  ;
  const v32 = stdlib.protect(ctc2, await interact.seeStream(v25), {
    at: './index.rsh:36:56:application',
    fs: ['at ./index.rsh:33:13:application call to [unknown function] (defined at: ./index.rsh:33:17:function exp)'],
    msg: 'seeStream',
    who: 'Bob'
    });
  
  const txn2 = await (ctc.sendrecv(2, 1, stdlib.checkedBigNumberify('./index.rsh:39:9:dot', stdlib.UInt_max, 0), [ctc4, ctc2], [v28, v32], [stdlib.checkedBigNumberify('./index.rsh:decimal', stdlib.UInt_max, 0), []], [ctc2], true, false, false, (async (txn2) => {
    const sim_r = { txns: [], mapRefs: [], mapsPrev: [], mapsNext: [] };
    
    sim_r.prevSt = stdlib.digest(ctc5, [stdlib.checkedBigNumberify('./index.rsh:39:9:dot', stdlib.UInt_max, 1), v28]);
    sim_r.prevSt_noPrevTime = stdlib.digest(ctc6, [stdlib.checkedBigNumberify('./index.rsh:39:9:dot', stdlib.UInt_max, 1)]);
    const [v34] = txn2.data;
    const v36 = txn2.time;
    const v33 = txn2.from;
    
    sim_r.txns.push({
      amt: stdlib.checkedBigNumberify('./index.rsh:decimal', stdlib.UInt_max, 0),
      kind: 'to',
      tok: undefined
      });
    sim_r.txns.push({
      kind: 'halt',
      tok: undefined
      })
    sim_r.nextSt = stdlib.digest(ctc3, []);
    sim_r.nextSt_noTime = stdlib.digest(ctc3, []);
    sim_r.view = [ctc3, []];
    sim_r.isHalt = true;
    
    return sim_r;
    })));
  const [v34] = txn2.data;
  const v36 = txn2.time;
  const v33 = txn2.from;
  ;
  return;
  
  
  };

const _ALGO = {
  appApproval: `#pragma version 3
txn RekeyTo
global ZeroAddress
==
assert
txn OnCompletion
int OptIn
==
bz normal
global GroupSize
int 1
==
assert
b done
normal:
gtxna 0 ApplicationArgs 8
store 5
// Check that everyone's here
global GroupSize
int 3
>=
assert
// Check txnAppl (us)
txn GroupIndex
int 0
==
assert
// Check txnFromHandler
int 0
gtxn 2 Sender
byte "{{m1}}"
==
||
gtxn 2 Sender
byte "{{m2}}"
==
||
assert
byte base64(cw==)
app_global_get
gtxna 0 ApplicationArgs 0
==
assert
byte base64(cw==)
gtxna 0 ApplicationArgs 1
app_global_put
byte base64(bA==)
app_global_get
gtxna 0 ApplicationArgs 5
btoi
==
assert
byte base64(bA==)
global Round
app_global_put
int 0
txn NumAccounts
==
assert
byte base64(aA==)
gtxna 0 ApplicationArgs 3
btoi
app_global_put
byte base64(aA==)
app_global_get
bnz halted
txn OnCompletion
int NoOp
==
assert
b done
halted:
txn OnCompletion
int DeleteApplication
==
assert
done:
int 1
return
`,
  appApproval0: `#pragma version 3
// Check that we're an App
txn TypeEnum
int appl
==
assert
txn RekeyTo
global ZeroAddress
==
assert
txn Sender
byte "{{Deployer}}"
==
assert
txn ApplicationID
bz init
global GroupSize
int 2
==
assert
gtxn 1 TypeEnum
int pay
==
assert
gtxn 1 Amount
int 100000
==
assert
// We don't check the receiver, because we don't know it yet, because the escrow account embeds our id
// We don't check the sender, because we don't care... anyone is allowed to fund it. We'll give it back to the deployer, though.
txn OnCompletion
int UpdateApplication
==
assert
byte base64(cw==)
// compute state in HM_Set 0
int 0
itob
keccak256
app_global_put
byte base64(bA==)
global Round
app_global_put
byte base64(aA==)
int 0
app_global_put
b done
init:
global GroupSize
int 1
==
assert
txn OnCompletion
int NoOp
==
assert
done:
int 1
return
`,
  appClear: `#pragma version 3
// We're alone
global GroupSize
int 1
==
assert
// We're halted
byte base64(aA==)
app_global_get
int 1
==
assert
done:
int 1
return
`,
  ctc: `#pragma version 3
// Check size
global GroupSize
int 3
>=
assert
// Check txnAppl
gtxn 0 TypeEnum
int appl
==
assert
gtxn 0 ApplicationID
byte "{{ApplicationID}}"
btoi
==
assert
// Don't check anything else, because app does
// Check us
txn TypeEnum
int pay
==
int axfer
dup2
==
||
assert
txn RekeyTo
global ZeroAddress
==
assert
txn GroupIndex
int 3
>=
assert
done:
int 1
return
`,
  mapArgSize: 165,
  mapDataKeys: 0,
  mapDataSize: 0,
  mapRecordSize: 33,
  stepargs: [null, {
    count: 9,
    size: 308
    }, {
    count: 9,
    size: 247
    }],
  steps: [null, `#pragma version 3
gtxna 0 ApplicationArgs 1
store 0
gtxna 0 ApplicationArgs 2
store 1
gtxna 0 ApplicationArgs 3
store 2
gtxna 0 ApplicationArgs 4
store 3
gtxna 0 ApplicationArgs 5
store 4
gtxna 0 ApplicationArgs 8
store 5
int 0
store 6
gtxna 0 ApplicationArgs 7
dup
substring 0 30
store 255
dup
substring 30 62
store 254
pop
// Handler 1
// Check txnAppl
gtxn 0 TypeEnum
int appl
==
assert
gtxn 0 ApplicationID
byte "{{ApplicationID}}"
btoi
==
assert
gtxn 0 NumAppArgs
int 9
==
assert
// Check txnToHandler
gtxn 1 TypeEnum
int pay
==
assert
gtxn 1 Receiver
txn Sender
==
assert
gtxn 1 Amount
gtxn 2 Fee
int 100000
+
==
assert
// Check txnFromHandler (us)
txn GroupIndex
int 2
==
assert
txn TypeEnum
int pay
==
assert
txn Amount
int 0
==
assert
txn Receiver
gtxn 1 Sender
==
assert
// compute state in HM_Check 0
int 0
itob
keccak256
gtxna 0 ApplicationArgs 0
==
assert
txn CloseRemainderTo
gtxn 1 Sender
==
assert
// Run body
// "CheckPay"
// "./index.rsh:30:9:dot"
// "[]"
gtxn 3 TypeEnum
int pay
==
assert
gtxn 3 Receiver
byte "{{ContractAddr}}"
==
assert
gtxn 3 Amount
load 3
btoi
==
assert
// We don't care who the sender is... this means that you can get other people to pay for you if you want.
byte base64()
load 1
==
assert
// compute state in HM_Set 1
int 1
itob
keccak256
load 0
==
assert
load 2
btoi
int 0
==
assert
// Check GroupSize
global GroupSize
int 4
==
assert
load 3
btoi
int 0
==
assert
// Check time limits
checkAccts:
gtxn 0 NumAccounts
load 6
==
assert
done:
int 1
return
`, `#pragma version 3
gtxna 0 ApplicationArgs 1
store 0
gtxna 0 ApplicationArgs 2
store 1
gtxna 0 ApplicationArgs 3
store 2
gtxna 0 ApplicationArgs 4
store 3
gtxna 0 ApplicationArgs 5
store 4
gtxna 0 ApplicationArgs 8
store 5
int 0
store 6
gtxna 0 ApplicationArgs 7
dup
substring 0 1
btoi
store 255
pop
// Handler 2
// Check txnAppl
gtxn 0 TypeEnum
int appl
==
assert
gtxn 0 ApplicationID
byte "{{ApplicationID}}"
btoi
==
assert
gtxn 0 NumAppArgs
int 9
==
assert
// Check txnToHandler
gtxn 1 TypeEnum
int pay
==
assert
gtxn 1 Receiver
txn Sender
==
assert
gtxn 1 Amount
gtxn 2 Fee
int 100000
+
==
assert
// Check txnFromHandler (us)
txn GroupIndex
int 2
==
assert
txn TypeEnum
int pay
==
assert
txn Amount
int 0
==
assert
txn Receiver
gtxn 1 Sender
==
assert
// compute state in HM_Check 1
int 1
itob
keccak256
gtxna 0 ApplicationArgs 0
==
assert
txn CloseRemainderTo
gtxn 1 Sender
==
assert
// Run body
// "CheckPay"
// "./index.rsh:39:9:dot"
// "[]"
gtxn 3 TypeEnum
int pay
==
assert
gtxn 3 Receiver
byte "{{ContractAddr}}"
==
assert
gtxn 3 Amount
load 3
btoi
==
assert
// We don't care who the sender is... this means that you can get other people to pay for you if you want.
byte base64()
load 1
==
assert
gtxn 4 TypeEnum
int pay
==
assert
// We don't check the receiver
gtxn 4 Amount
int 0
==
assert
gtxn 4 Sender
byte "{{ContractAddr}}"
==
assert
gtxn 4 CloseRemainderTo
byte "{{Deployer}}"
==
assert
load 2
btoi
int 1
==
assert
// Check GroupSize
global GroupSize
int 5
==
assert
load 3
btoi
gtxn 4 Fee
==
assert
// Check time limits
checkAccts:
gtxn 0 NumAccounts
load 6
==
assert
done:
int 1
return
`],
  unsupported: [],
  version: 1,
  viewKeys: 0,
  viewSize: 0
  };
const _ETH = {
  ABI: `[
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "e0",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "v19",
                "type": "uint256"
              }
            ],
            "internalType": "struct T0",
            "name": "svs",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint8[30]",
                "name": "v25",
                "type": "uint8[30]"
              },
              {
                "internalType": "address payable",
                "name": "v26",
                "type": "address"
              }
            ],
            "internalType": "struct T2",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct T3",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "e1",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "v28",
                "type": "uint256"
              }
            ],
            "internalType": "struct T1",
            "name": "svs",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "v34",
                "type": "bool"
              }
            ],
            "internalType": "struct T4",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct T5",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "e2",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "v19",
                "type": "uint256"
              }
            ],
            "internalType": "struct T0",
            "name": "svs",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "uint8[30]",
                "name": "v25",
                "type": "uint8[30]"
              },
              {
                "internalType": "address payable",
                "name": "v26",
                "type": "address"
              }
            ],
            "internalType": "struct T2",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "internalType": "struct T3",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "m1",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "v28",
                "type": "uint256"
              }
            ],
            "internalType": "struct T1",
            "name": "svs",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "v34",
                "type": "bool"
              }
            ],
            "internalType": "struct T4",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "internalType": "struct T5",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "m2",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]`,
  Bytecode: `0x608060408190527f49ff028a829527a47ec6839c7147b484eccf5a2a94853eddac09cef44d9d4e9e90600090a160408051602080820183524382528251808201845260008082529251815283518083018490529051818501528351808203850181526060909101909352825192019190912090556102a1806100826000396000f3fe60806040526004361061002d5760003560e01c8063cdcaf84614610039578063cff5da111461004e57610034565b3661003457005b600080fd5b61004c6100473660046101a6565b610061565b005b61004c61005c3660046101be565b61011c565b60408051600060208201528235918101919091526060016040516020818303038152906040528051906020012060001c6000541461009e57600080fd5b6000805534156100ad57600080fd5b7f1070359a6ac4393af35b598c864fc95346f3632bf5e15e54de2c3778a1676b95816040516100dc91906101cf565b60405180910390a1506040805160208082018352438252825160018183015291518284015282518083038401815260609092019092528051910120600055565b60408051600160208201528235918101919091526060016040516020818303038152906040528051906020012060001c6000541461015957600080fd5b60008055341561016857600080fd5b7f12bfe1c7b9111fce6718feb7c2d10776024f3d35e03ad4bb55c7bc205788b769816040516101979190610241565b60405180910390a16000805533ff5b600061040082840312156101b8578081fd5b50919050565b6000604082840312156101b8578081fd5b813581526104008101602080830181850160005b601e81101561021157813560ff81168082146101fe57600080fd5b84525091830191908301906001016101e3565b506103e092505050838101356001600160a01b03811680821461023357600080fd5b808386015250505092915050565b8135815260408101602083013580151580821461025d57600080fd5b80602085015250509291505056fea2646970667358221220ebf80d726852f4874d5ef57b3d996d755c26fb9b5fb3eaf855c55153e91a04b564736f6c63430008020033`,
  BytecodeLen: 803,
  Which: `oD`,
  deployMode: `DM_constructor`,
  views: {
    }
  };

export const _Connectors = {
  ALGO: _ALGO,
  ETH: _ETH
  };

