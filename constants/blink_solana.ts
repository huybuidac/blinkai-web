/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blink_solana.json`.
 */
export type BlinkSolana = {
  address: 'DxUAH8uUQigjfCxoSygWNaqfktzrCYWshxa4KsCMihK5';
  metadata: {
    name: 'blinkSolana';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'createPool';
      discriminator: [233, 146, 209, 142, 207, 104, 64, 188];
      accounts: [
        {
          name: 'authority';
          writable: true;
          signer: true;
          relations: ['state'];
        },
        {
          name: 'state';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: 'pool';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [112, 111, 111, 108];
              },
              {
                kind: 'arg';
                path: 'slug';
              }
            ];
          };
        },
        {
          name: 'vault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: 'arg';
                path: 'slug';
              }
            ];
          };
        },
        {
          name: 'feeVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [102, 101, 101, 45, 118, 97, 117, 108, 116];
              },
              {
                kind: 'arg';
                path: 'slug';
              }
            ];
          };
        },
        {
          name: 'mint';
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'slug';
          type: 'string';
        },
        {
          name: 'userMaxAmount';
          type: 'u64';
        },
        {
          name: 'fee';
          type: 'u64';
        }
      ];
    },
    {
      name: 'createState';
      discriminator: [214, 211, 209, 79, 107, 105, 247, 222];
      accounts: [
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'state';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 97, 116, 101];
              }
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        }
      ];
      args: [];
    },
    {
      name: 'deposit';
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
      accounts: [
        {
          name: 'pool';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [112, 111, 111, 108];
              },
              {
                kind: 'arg';
                path: 'slug';
              }
            ];
          };
        },
        {
          name: 'mint';
          relations: ['pool'];
        },
        {
          name: 'vault';
          writable: true;
          relations: ['pool'];
        },
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'userPool';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [117, 115, 101, 114, 95, 112, 111, 111, 108];
              },
              {
                kind: 'arg';
                path: 'slug';
              },
              {
                kind: 'account';
                path: 'authority';
              }
            ];
          };
        },
        {
          name: 'userVault';
          writable: true;
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'slug';
          type: 'string';
        },
        {
          name: 'amount';
          type: 'u64';
        }
      ];
    },
    {
      name: 'withdraw';
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
      accounts: [
        {
          name: 'pool';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [112, 111, 111, 108];
              },
              {
                kind: 'arg';
                path: 'slug';
              }
            ];
          };
        },
        {
          name: 'mint';
          relations: ['pool'];
        },
        {
          name: 'vault';
          writable: true;
          relations: ['pool'];
        },
        {
          name: 'feeVault';
          writable: true;
          relations: ['pool'];
        },
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'userVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'authority';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              }
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: 'userPool';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [117, 115, 101, 114, 95, 112, 111, 111, 108];
              },
              {
                kind: 'arg';
                path: 'slug';
              },
              {
                kind: 'account';
                path: 'authority';
              }
            ];
          };
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'slug';
          type: 'string';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'poolAccount';
      discriminator: [116, 210, 187, 119, 196, 196, 52, 137];
    },
    {
      name: 'stateAccount';
      discriminator: [142, 247, 54, 95, 85, 133, 249, 103];
    },
    {
      name: 'userPoolAccount';
      discriminator: [9, 224, 193, 133, 124, 120, 200, 50];
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'invalidSlug';
      msg: 'Invalid slug';
    },
    {
      code: 6001;
      name: 'invalidAcceptedAmount';
      msg: 'Invalid accepted amount';
    },
    {
      code: 6002;
      name: 'invalidFeePercent';
      msg: 'Invalid fee percent';
    },
    {
      code: 6003;
      name: 'overMaxAmount';
      msg: 'Over max amount';
    },
    {
      code: 6004;
      name: 'notDeposited';
      msg: 'User not deposited';
    },
    {
      code: 6005;
      name: 'invalidVault';
      msg: 'Invalid vault';
    },
    {
      code: 6006;
      name: 'invalidFeeVault';
      msg: 'Invalid fee vault';
    },
    {
      code: 6007;
      name: 'invalidMint';
      msg: 'Invalid mint';
    },
    {
      code: 6008;
      name: 'unauthorized';
      msg: 'unauthorized';
    }
  ];
  types: [
    {
      name: 'poolAccount';
      serialization: 'bytemuck';
      repr: {
        kind: 'c';
      };
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'mint';
            type: 'pubkey';
          },
          {
            name: 'vault';
            type: 'pubkey';
          },
          {
            name: 'feeVault';
            type: 'pubkey';
          },
          {
            name: 'slug';
            type: {
              array: ['u8', 32];
            };
          },
          {
            name: 'userMaxAmount';
            type: 'u64';
          },
          {
            name: 'totalAmount';
            type: 'u64';
          },
          {
            name: 'feePercent';
            type: 'u64';
          },
          {
            name: 'feeAmount';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'stateAccount';
      serialization: 'bytemuck';
      repr: {
        kind: 'c';
      };
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'pubkey';
          }
        ];
      };
    },
    {
      name: 'userPoolAccount';
      serialization: 'bytemuck';
      repr: {
        kind: 'c';
      };
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'pool';
            type: 'pubkey';
          },
          {
            name: 'authority';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          }
        ];
      };
    }
  ];
};
