/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-krakenexchange/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { createHmac } from 'crypto';
import { stringify } from 'querystring';

export class KrakenExchange implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kraken Exchange',
    name: 'krakenexchange',
    icon: 'file:krakenexchange.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Kraken Exchange API',
    defaults: {
      name: 'Kraken Exchange',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'krakenexchangeApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'MarketData',
            value: 'marketData',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Trading',
            value: 'trading',
          },
          {
            name: 'Funding',
            value: 'funding',
          },
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'Earn',
            value: 'earn',
          }
        ],
        default: 'marketData',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['marketData'],
		},
	},
	options: [
		{
			name: 'Get Server Time',
			value: 'getServerTime',
			description: 'Get server time',
			action: 'Get server time',
		},
		{
			name: 'Get System Status',
			value: 'getSystemStatus',
			description: 'Get system status',
			action: 'Get system status',
		},
		{
			name: 'Get Assets',
			value: 'getAssets',
			description: 'Get asset information',
			action: 'Get asset information',
		},
		{
			name: 'Get Asset Pairs',
			value: 'getAssetPairs',
			description: 'Get tradable asset pairs',
			action: 'Get asset pairs',
		},
		{
			name: 'Get Ticker',
			value: 'getTicker',
			description: 'Get ticker information',
			action: 'Get ticker information',
		},
		{
			name: 'Get OHLC',
			value: 'getOHLC',
			description: 'Get OHLC data',
			action: 'Get OHLC data',
		},
		{
			name: 'Get Order Book',
			value: 'getOrderBook',
			description: 'Get order book',
			action: 'Get order book',
		},
		{
			name: 'Get Recent Trades',
			value: 'getRecentTrades',
			description: 'Get recent trades',
			action: 'Get recent trades',
		},
		{
			name: 'Get Recent Spreads',
			value: 'getRecentSpreads',
			description: 'Get recent spread data',
			action: 'Get recent spreads',
		},
	],
	default: 'getServerTime',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['account'] } },
	options: [
		{ name: 'Get Account Balance', value: 'getAccountBalance', description: 'Get account balance', action: 'Get account balance' },
		{ name: 'Get Extended Balance', value: 'getExtendedBalance', description: 'Get extended balance with hold amounts', action: 'Get extended balance' },
		{ name: 'Get Trade Balance', value: 'getTradeBalance', description: 'Get trade balance info', action: 'Get trade balance' },
		{ name: 'Get Open Orders', value: 'getOpenOrders', description: 'Get open orders', action: 'Get open orders' },
		{ name: 'Get Closed Orders', value: 'getClosedOrders', description: 'Get closed orders', action: 'Get closed orders' },
		{ name: 'Query Orders', value: 'queryOrders', description: 'Query specific orders', action: 'Query orders' },
		{ name: 'Get Trades History', value: 'getTradesHistory', description: 'Get trade history', action: 'Get trades history' },
		{ name: 'Query Trades', value: 'queryTrades', description: 'Query specific trades', action: 'Query trades' },
		{ name: 'Get Open Positions', value: 'getOpenPositions', description: 'Get open positions', action: 'Get open positions' },
		{ name: 'Get Ledgers', value: 'getLedgers', description: 'Get ledger info', action: 'Get ledgers' },
		{ name: 'Query Ledgers', value: 'queryLedgers', description: 'Query specific ledgers', action: 'Query ledgers' }
	],
	default: 'getAccountBalance',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['trading'] } },
	options: [
		{ name: 'Create Order', value: 'createOrder', description: 'Place new order', action: 'Create order' },
		{ name: 'Create Batch Orders', value: 'createBatchOrders', description: 'Place multiple orders', action: 'Create batch orders' },
		{ name: 'Update Order', value: 'updateOrder', description: 'Edit existing order', action: 'Update order' },
		{ name: 'Delete Order', value: 'deleteOrder', description: 'Cancel order', action: 'Delete order' },
		{ name: 'Delete All Orders', value: 'deleteAllOrders', description: 'Cancel all orders', action: 'Delete all orders' },
		{ name: 'Cancel All After', value: 'cancelAllAfter', description: 'Cancel all orders after timeout', action: 'Cancel all after timeout' },
	],
	default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['funding'] } },
  options: [
    { name: 'Get Deposit Methods', value: 'getDepositMethods', description: 'Get available deposit methods for an asset', action: 'Get deposit methods' },
    { name: 'Get Deposit Addresses', value: 'getDepositAddresses', description: 'Get deposit addresses for an asset', action: 'Get deposit addresses' },
    { name: 'Get Deposit Status', value: 'getDepositStatus', description: 'Get status of recent deposits', action: 'Get deposit status' },
    { name: 'Get Withdrawal Info', value: 'getWithdrawalInfo', description: 'Get withdrawal information', action: 'Get withdrawal info' },
    { name: 'Create Withdrawal', value: 'createWithdrawal', description: 'Initiate a withdrawal', action: 'Create withdrawal' },
    { name: 'Get Withdrawal Status', value: 'getWithdrawalStatus', description: 'Get status of recent withdrawals', action: 'Get withdrawal status' },
    { name: 'Cancel Withdrawal', value: 'cancelWithdrawal', description: 'Cancel a pending withdrawal', action: 'Cancel withdrawal' },
  ],
  default: 'getDepositMethods',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['staking'] } },
  options: [
    { name: 'Get Stakeable Assets', value: 'getStakingAssets', description: 'Get available stakeable assets', action: 'Get stakeable assets' },
    { name: 'Get Pending Staking', value: 'getPendingStaking', description: 'Get pending staking transactions', action: 'Get pending staking transactions' },
    { name: 'Get Staking Transactions', value: 'getStakingTransactions', description: 'Get staking transaction history', action: 'Get staking transactions' },
    { name: 'Create Stake', value: 'createStake', description: 'Stake assets', action: 'Create stake' },
    { name: 'Create Unstake', value: 'createUnstake', description: 'Unstake assets', action: 'Create unstake' },
  ],
  default: 'getStakingAssets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['earn'] } },
  options: [
    { name: 'Get Earn Strategies', value: 'getEarnStrategies', description: 'Get available earn strategies', action: 'Get earn strategies' },
    { name: 'Get Earn Allocations', value: 'getEarnAllocations', description: 'Get current earn allocations', action: 'Get earn allocations' },
    { name: 'Create Earn Allocation', value: 'createEarnAllocation', description: 'Allocate funds to earn strategy', action: 'Create earn allocation' },
    { name: 'Create Earn Deallocation', value: 'createEarnDeallocation', description: 'Deallocate funds from earn strategy', action: 'Create earn deallocation' }
  ],
  default: 'getEarnStrategies',
},
{
	displayName: 'Asset',
	name: 'asset',
	type: 'string',
	default: '',
	placeholder: 'XXBT,ZUSD',
	description: 'Comma delimited list of assets to get info on',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getAssets'],
		},
	},
},
{
	displayName: 'Asset Class',
	name: 'aclass',
	type: 'options',
	options: [
		{
			name: 'Currency',
			value: 'currency',
		},
	],
	default: 'currency',
	description: 'Asset class',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getAssets'],
		},
	},
},
{
	displayName: 'Pair',
	name: 'pair',
	type: 'string',
	default: '',
	placeholder: 'XBTUSD,ETHUSD',
	description: 'Comma delimited list of asset pairs to get info on',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getAssetPairs', 'getTicker', 'getOHLC', 'getOrderBook', 'getRecentTrades', 'getRecentSpreads'],
		},
	},
},
{
	displayName: 'Info',
	name: 'info',
	type: 'options',
	options: [
		{
			name: 'Info',
			value: 'info',
		},
		{
			name: 'Leverage',
			value: 'leverage',
		},
		{
			name: 'Fees',
			value: 'fees',
		},
		{
			name: 'Margin',
			value: 'margin',
		},
	],
	default: 'info',
	description: 'Info to retrieve',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getAssetPairs'],
		},
	},
},
{
	displayName: 'Interval',
	name: 'interval',
	type: 'options',
	options: [
		{
			name: '1 minute',
			value: '1',
		},
		{
			name: '5 minutes',
			value: '5',
		},
		{
			name: '15 minutes',
			value: '15',
		},
		{
			name: '30 minutes',
			value: '30',
		},
		{
			name: '1 hour',
			value: '60',
		},
		{
			name: '4 hours',
			value: '240',
		},
		{
			name: '1 day',
			value: '1440',
		},
		{
			name: '1 week',
			value: '10080',
		},
		{
			name: '15 days',
			value: '21600',
		},
	],
	default: '1',
	description: 'Time frame interval in minutes',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getOHLC'],
		},
	},
},
{
	displayName: 'Since',
	name: 'since',
	type: 'string',
	default: '',
	placeholder: '1548111600',
	description: 'Return committed OHLC data since given id',
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getOHLC', 'getRecentTrades', 'getRecentSpreads'],
		},
	},
},
{
	displayName: 'Count',
	name: 'count',
	type: 'number',
	default: 100,
	description: 'Maximum number of asks/bids',
	typeOptions: {
		minValue: 1,
		maxValue: 500,
	},
	displayOptions: {
		show: {
			resource: ['marketData'],
			operation: ['getOrderBook'],
		},
	},
},
{
	displayName: 'Asset',
	name: 'asset',
	type: 'string',
	displayOptions: { show: { resource: ['account'], operation: ['getTradeBalance'] } },
	default: '',
	description: 'Base asset used to determine balance',
},
{
	displayName: 'Include Trades',
	name: 'trades',
	type: 'boolean',
	displayOptions: { show: { resource: ['account'], operation: ['getOpenOrders', 'getClosedOrders', 'queryOrders', 'getTradesHistory', 'queryTrades'] } },
	default: false,
	description: 'Whether to include trades in output',
},
{
	displayName: 'User Reference',
	name: 'userref',
	type: 'string',
	displayOptions: { show: { resource: ['account'], operation: ['getOpenOrders', 'getClosedOrders', 'queryOrders'] } },
	default: '',
	description: 'Restrict results to given user reference id',
},
{
	displayName: 'Start Time',
	name: 'start',
	type: 'number',
	displayOptions: { show: { resource: ['account'], operation: ['getClosedOrders', 'getTradesHistory', 'getLedgers'] } },
	default: 0,
	description: 'Starting unix timestamp or order tx id of results',
},
{
	displayName: 'End Time',
	name: 'end',
	type: 'number',
	displayOptions: { show: { resource: ['account'], operation: ['getClosedOrders', 'getTradesHistory', 'getLedgers'] } },
	default: 0,
	description: 'Ending unix timestamp or order tx id of results',
},
{
	displayName: 'Offset',
	name: 'ofs',
	type: 'number',
	displayOptions: { show: { resource: ['account'], operation: ['getClosedOrders', 'getTradesHistory', 'getLedgers'] } },
	default: 0,
	description: 'Result offset',
},
{
	displayName: 'Close Time',
	name: 'closetime',
	type: 'options',
	displayOptions: { show: { resource: ['account'], operation: ['getClosedOrders'] } },
	options: [
		{ name: 'Open', value: 'open' },
		{ name: 'Close', value: 'close' },
		{ name: 'Both', value: 'both' }
	],
	default: 'both',
	description: 'Which time to use',
},
{
	displayName: 'Transaction ID',
	name: 'txid',
	type: 'string',
	displayOptions: { show: { resource: ['account'], operation: ['queryOrders', 'queryTrades', 'getOpenPositions'] } },
	default: '',
	description: 'Comma delimited list of transaction ids to query info about',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'options',
	displayOptions: { show: { resource: ['account'], operation: ['getTradesHistory', 'getLedgers'] } },
	options: [
		{ name: 'All', value: 'all' },
		{ name: 'Buy', value: 'buy' },
		{ name: 'Sell', value: 'sell' }
	],
	default: 'all',
	description: 'Type of trade or ledger',
},
{
	displayName: 'Do Calculations',
	name: 'docalcs',
	type: 'boolean',
	displayOptions: { show: { resource: ['account'], operation: ['getOpenPositions'] } },
	default: false,
	description: 'Whether to include profit/loss calculations',
},
{
	displayName: 'Consolidation',
	name: 'consolidation',
	type: 'options',
	displayOptions: { show: { resource: ['account'], operation: ['getOpenPositions'] } },
	options: [
		{ name: 'Market', value: 'market' }
	],
	default: 'market',
	description: 'Consolidate positions by market',
},
{
	displayName: 'Asset Class',
	name: 'aclass',
	type: 'string',
	displayOptions: { show: { resource: ['account'], operation: ['getLedgers'] } },
	default: 'currency',
	description: 'Asset class',
},
{
	displayName: 'Ledger ID',
	name: 'id',
	type: 'string',
	displayOptions: { show: { resource: ['account'], operation: ['queryLedgers'] } },
	default: '',
	description: 'Comma delimited list of ledger ids to query info about',
},
{
	displayName: 'Currency Pair',
	name: 'pair',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'createBatchOrders', 'updateOrder'] } },
	default: '',
	description: 'Asset pair',
},
{
	displayName: 'Order Type',
	name: 'type',
	type: 'options',
	required: true,
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
	options: [
		{ name: 'Buy', value: 'buy' },
		{ name: 'Sell', value: 'sell' },
	],
	default: 'buy',
	description: 'Type of order',
},
{
	displayName: 'Order Type Detail',
	name: 'ordertype',
	type: 'options',
	required: true,
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
	options: [
		{ name: 'Market', value: 'market' },
		{ name: 'Limit', value: 'limit' },
		{ name: 'Stop Loss', value: 'stop-loss' },
		{ name: 'Take Profit', value: 'take-profit' },
		{ name: 'Stop Loss Limit', value: 'stop-loss-limit' },
		{ name: 'Take Profit Limit', value: 'take-profit-limit' },
		{ name: 'Settle Position', value: 'settle-position' },
	],
	default: 'market',
	description: 'Order type',
},
{
	displayName: 'Volume',
	name: 'volume',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder'] } },
	default: '',
	description: 'Order volume in lots',
},
{
	displayName: 'Price',
	name: 'price',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder'] } },
	default: '',
	description: 'Price for limit orders',
},
{
	displayName: 'Secondary Price',
	name: 'price2',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder'] } },
	default: '',
	description: 'Secondary price for stop-loss-limit and take-profit-limit orders',
},
{
	displayName: 'Leverage',
	name: 'leverage',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
	default: '',
	description: 'Amount of leverage desired',
},
{
	displayName: 'Order Flags',
	name: 'oflags',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder'] } },
	default: '',
	description: 'Comma delimited list of order flags',
},
{
	displayName: 'Start Time',
	name: 'starttm',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
	default: '',
	description: 'Scheduled start time',
},
{
	displayName: 'Expire Time',
	name: 'expiretm',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
	default: '',
	description: 'Expiration time',
},
{
	displayName: 'User Reference',
	name: 'userref',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
	default: '',
	description: 'User reference ID',
},
{
	displayName: 'New User Reference',
	name: 'newuserref',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['updateOrder'] } },
	default: '',
	description: 'New user reference ID for order update',
},
{
	displayName: 'Validate Only',
	name: 'validate',
	type: 'boolean',
	displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'createBatchOrders', 'updateOrder'] } },
	default: false,
	description: 'Validate inputs only, do not submit order',
},
{
	displayName: 'Orders',
	name: 'orders',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['trading'], operation: ['createBatchOrders'] } },
	default: '[]',
	description: 'Array of order objects',
},
{
	displayName: 'Deadline',
	name: 'deadline',
	type: 'string',
	displayOptions: { show: { resource: ['trading'], operation: ['createBatchOrders'] } },
	default: '',
	description: 'RFC3339 timestamp after which matching engine should reject new order request',
},
{
	displayName: 'Transaction ID',
	name: 'txid',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['trading'], operation: ['updateOrder', 'deleteOrder'] } },
	default: '',
	description: 'Transaction ID for order to edit or cancel',
},
{
	displayName: 'Timeout',
	name: 'timeout',
	type: 'number',
	required: true,
	displayOptions: { show: { resource: ['trading'], operation: ['cancelAllAfter'] } },
	default: 0,
	description: 'Duration in seconds to automatically cancel all user orders',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['funding'],
      operation: ['getDepositMethods', 'getDepositAddresses', 'getDepositStatus', 'getWithdrawalInfo', 'createWithdrawal', 'getWithdrawalStatus', 'cancelWithdrawal']
    }
  },
  default: '',
  description: 'Asset symbol (e.g., BTC, ETH)',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['funding'],
      operation: ['getDepositAddresses', 'getDepositStatus', 'getWithdrawalStatus']
    }
  },
  default: '',
  description: 'Deposit/withdrawal method name',
},
{
  displayName: 'Generate New Address',
  name: 'new',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['funding'],
      operation: ['getDepositAddresses']
    }
  },
  default: false,
  description: 'Whether to generate a new address',
},
{
  displayName: 'Withdrawal Key',
  name: 'key',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['funding'],
      operation: ['getWithdrawalInfo', 'createWithdrawal']
    }
  },
  default: '',
  description: 'Withdrawal key name as set up on your account',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['funding'],
      operation: ['getWithdrawalInfo', 'createWithdrawal']
    }
  },
  default: '',
  description: 'Amount to withdraw',
},
{
  displayName: 'Reference ID',
  name: 'refid',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['funding'],
      operation: ['cancelWithdrawal']
    }
  },
  default: '',
  description: 'Withdrawal reference ID',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake', 'createUnstake'],
    },
  },
  default: '',
  description: 'Asset to stake or unstake',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake', 'createUnstake'],
    },
  },
  default: '',
  description: 'Amount to stake or unstake',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake', 'createUnstake'],
    },
  },
  default: '',
  description: 'Staking method (optional)',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  default: '',
  description: 'Asset to filter strategies for',
  displayOptions: {
    show: {
      resource: ['earn'],
      operation: ['getEarnStrategies']
    }
  }
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  default: '',
  description: 'Pagination cursor for strategies',
  displayOptions: {
    show: {
      resource: ['earn'],
      operation: ['getEarnStrategies']
    }
  }
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 10,
  description: 'Number of strategies to return',
  displayOptions: {
    show: {
      resource: ['earn'],
      operation: ['getEarnStrategies']
    }
  }
},
{
  displayName: 'Converted Asset',
  name: 'convertedAsset',
  type: 'string',
  default: '',
  description: 'Asset to show allocations in',
  displayOptions: {
    show: {
      resource: ['earn'],
      operation: ['getEarnAllocations']
    }
  }
},
{
  displayName: 'Hide Zero Allocations',
  name: 'hideZeroAllocations',
  type: 'boolean',
  default: true,
  description: 'Whether to hide zero allocations',
  displayOptions: {
    show: {
      resource: ['earn'],
      operation: ['getEarnAllocations']
    }
  }
},
{
  displayName: 'Strategy ID',
  name: 'strategyId',
  type: 'string',
  required: true,
  default: '',
  description: 'ID of the earn strategy',
  displayOptions: {
    show: {
      resource: ['earn'],
      operation: ['createEarnAllocation', 'createEarnDeallocation']
    }
  }
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  default: '',
  description: 'Amount to allocate or deallocate',
  displayOptions: {
    show: {
      resource: ['earn'],
      operation: ['createEarnAllocation', 'createEarnDeallocation']
    }
  }
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'marketData':
        return [await executeMarketDataOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'trading':
        return [await executeTradingOperations.call(this, items)];
      case 'funding':
        return [await executeFundingOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'earn':
        return [await executeEarnOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeMarketDataOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getServerTime': {
					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/Time',
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSystemStatus': {
					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/SystemStatus',
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAssets': {
					const asset = this.getNodeParameter('asset', i) as string;
					const aclass = this.getNodeParameter('aclass', i) as string;

					const params: any = {};
					if (asset) params.asset = asset;
					if (aclass) params.aclass = aclass;

					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/Assets',
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAssetPairs': {
					const pair = this.getNodeParameter('pair', i) as string;
					const info = this.getNodeParameter('info', i) as string;

					const params: any = {};
					if (pair) params.pair = pair;
					if (info) params.info = info;

					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/AssetPairs',
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTicker': {
					const pair = this.getNodeParameter('pair', i) as string;

					const params: any = {};
					if (pair) params.pair = pair;

					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/Ticker',
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getOHLC': {
					const pair = this.getNodeParameter('pair', i) as string;
					const interval = this.getNodeParameter('interval', i) as string;
					const since = this.getNodeParameter('since', i) as string;

					const params: any = {};
					if (pair) params.pair = pair;
					if (interval) params.interval = interval;
					if (since) params.since = since;

					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/OHLC',
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getOrderBook': {
					const pair = this.getNodeParameter('pair', i) as string;
					const count = this.getNodeParameter('count', i) as number;

					const params: any = {};
					if (pair) params.pair = pair;
					if (count) params.count = count;

					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/Depth',
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getRecentTrades': {
					const pair = this.getNodeParameter('pair', i) as string;
					const since = this.getNodeParameter('since', i) as string;

					const params: any = {};
					if (pair) params.pair = pair;
					if (since) params.since = since;

					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/Trades',
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getRecentSpreads': {
					const pair = this.getNodeParameter('pair', i) as string;
					const since = this.getNodeParameter('since', i) as string;

					const params: any = {};
					if (pair) params.pair = pair;
					if (since) params.since = since;

					const options: any = {
						method: 'GET',
						url: 'https://api.kraken.com/0/public/Spread',
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAccountOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('krakenexchangeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const nonce = Date.now() * 1000;
			
			switch (operation) {
				case 'getAccountBalance': {
					const path = '/0/private/Balance';
					const postData = querystring.stringify({ nonce });
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getExtendedBalance': {
					const path = '/0/private/BalanceEx';
					const postData = querystring.stringify({ nonce });
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getTradeBalance': {
					const asset = this.getNodeParameter('asset', i) as string;
					const path = '/0/private/TradeBalance';
					const params: any = { nonce };
					if (asset) params.asset = asset;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getOpenOrders': {
					const trades = this.getNodeParameter('trades', i) as boolean;
					const userref = this.getNodeParameter('userref', i) as string;
					const path = '/0/private/OpenOrders';
					const params: any = { nonce };
					if (trades) params.trades = trades;
					if (userref) params.userref = userref;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getClosedOrders': {
					const trades = this.getNodeParameter('trades', i) as boolean;
					const userref = this.getNodeParameter('userref', i) as string;
					const start = this.getNodeParameter('start', i) as number;
					const end = this.getNodeParameter('end', i) as number;
					const ofs = this.getNodeParameter('ofs', i) as number;
					const closetime = this.getNodeParameter('closetime', i) as string;
					const path = '/0/private/ClosedOrders';
					const params: any = { nonce };
					if (trades) params.trades = trades;
					if (userref) params.userref = userref;
					if (start) params.start = start;
					if (end) params.end = end;
					if (ofs) params.ofs = ofs;
					if (closetime) params.closetime = closetime;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'queryOrders': {
					const trades = this.getNodeParameter('trades', i) as boolean;
					const userref = this.getNodeParameter('userref', i) as string;
					const txid = this.getNodeParameter('txid', i) as string;
					const path = '/0/private/QueryOrders';
					const params: any = { nonce };
					if (trades) params.trades = trades;
					if (userref) params.userref = userref;
					if (txid) params.txid = txid;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getTradesHistory': {
					const type = this.getNodeParameter('type', i) as string;
					const trades = this.getNodeParameter('trades', i) as boolean;
					const start = this.getNodeParameter('start', i) as number;
					const end = this.getNodeParameter('end', i) as number;
					const ofs = this.getNodeParameter('ofs', i) as number;
					const path = '/0/private/TradesHistory';
					const params: any = { nonce };
					if (type) params.type = type;
					if (trades) params.trades = trades;
					if (start) params.start = start;
					if (end) params.end = end;
					if (ofs) params.ofs = ofs;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'queryTrades': {
					const txid = this.getNodeParameter('txid', i) as string;
					const trades = this.getNodeParameter('trades', i) as boolean;
					const path = '/0/private/QueryTrades';
					const params: any = { nonce };
					if (txid) params.txid = txid;
					if (trades) params.trades = trades;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getOpenPositions': {
					const txid = this.getNodeParameter('txid', i) as string;
					const docalcs = this.getNodeParameter('docalcs', i) as boolean;
					const consolidation = this.getNodeParameter('consolidation', i) as string;
					const path = '/0/private/OpenPositions';
					const params: any = { nonce };
					if (txid) params.txid = txid;
					if (docalcs) params.docalcs = docalcs;
					if (consolidation) params.consolidation = consolidation;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getLedgers': {
					const asset = this.getNodeParameter('asset', i) as string;
					const aclass = this.getNodeParameter('aclass', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const start = this.getNodeParameter('start', i) as number;
					const end = this.getNodeParameter('end', i) as number;
					const ofs = this.getNodeParameter('ofs', i) as number;
					const path = '/0/private/Ledgers';
					const params: any = { nonce };
					if (asset) params.asset = asset;
					if (aclass) params.aclass = aclass;
					if (type) params.type = type;
					if (start) params.start = start;
					if (end) params.end = end;
					if (ofs) params.ofs = ofs;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'queryLedgers': {
					const id = this.getNodeParameter('id', i) as string;
					const path = '/0/private/QueryLedgers';
					const params: any = { nonce };
					if (id) params.id = id;
					const postData = querystring.stringify(params);
					const signature = this.generateSignature(path, postData, credentials.privateKey, nonce);
					
					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: postData,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}
			
			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}
	
	return returnData;
}

function generateSignature(path: string, postData: string, privateKey: string, nonce: number): string {
	const hash = crypto.createHash('sha256');
	const hmac = crypto.createHmac('sha512', Buffer.from(privateKey, 'base64'));
	const hashDigest = hash.update(nonce + postData).digest();
	const hmacDigest = hmac.update(path + hashDigest, 'latin1').digest('base64');
	return hmacDigest;
}

async function executeTradingOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('krakenexchangeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createOrder': {
					const pair = this.getNodeParameter('pair', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const ordertype = this.getNodeParameter('ordertype', i) as string;
					const volume = this.getNodeParameter('volume', i) as string;
					const price = this.getNodeParameter('price', i, '') as string;
					const price2 = this.getNodeParameter('price2', i, '') as string;
					const leverage = this.getNodeParameter('leverage', i, '') as string;
					const oflags = this.getNodeParameter('oflags', i, '') as string;
					const starttm = this.getNodeParameter('starttm', i, '') as string;
					const expiretm = this.getNodeParameter('expiretm', i, '') as string;
					const userref = this.getNodeParameter('userref', i, '') as string;
					const validate = this.getNodeParameter('validate', i, false) as boolean;

					const postData: any = {
						nonce: Date.now() * 1000,
						pair,
						type,
						ordertype,
						volume,
					};

					if (price) postData.price = price;
					if (price2) postData.price2 = price2;
					if (leverage) postData.leverage = leverage;
					if (oflags) postData.oflags = oflags;
					if (starttm) postData.starttm = starttm;
					if (expiretm) postData.expiretm = expiretm;
					if (userref) postData.userref = userref;
					if (validate) postData.validate = 'true';

					const body = querystring.stringify(postData);
					const path = '/0/private/AddOrder';
					const signature = crypto
						.createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'))
						.update(path + crypto.createHash('sha256').update(postData.nonce + body).digest())
						.digest('base64');

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createBatchOrders': {
					const orders = this.getNodeParameter('orders', i) as string;
					const pair = this.getNodeParameter('pair', i) as string;
					const deadline = this.getNodeParameter('deadline', i, '') as string;
					const validate = this.getNodeParameter('validate', i, false) as boolean;

					const postData: any = {
						nonce: Date.now() * 1000,
						orders,
						pair,
					};

					if (deadline) postData.deadline = deadline;
					if (validate) postData.validate = 'true';

					const body = querystring.stringify(postData);
					const path = '/0/private/AddOrderBatch';
					const signature = crypto
						.createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'))
						.update(path + crypto.createHash('sha256').update(postData.nonce + body).digest())
						.digest('base64');

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateOrder': {
					const txid = this.getNodeParameter('txid', i) as string;
					const pair = this.getNodeParameter('pair', i) as string;
					const volume = this.getNodeParameter('volume', i) as string;
					const price = this.getNodeParameter('price', i, '') as string;
					const price2 = this.getNodeParameter('price2', i, '') as string;
					const oflags = this.getNodeParameter('oflags', i, '') as string;
					const newuserref = this.getNodeParameter('newuserref', i, '') as string;
					const validate = this.getNodeParameter('validate', i, false) as boolean;

					const postData: any = {
						nonce: Date.now() * 1000,
						txid,
						pair,
						volume,
					};

					if (price) postData.price = price;
					if (price2) postData.price2 = price2;
					if (oflags) postData.oflags = oflags;
					if (newuserref) postData.newuserref = newuserref;
					if (validate) postData.validate = 'true';

					const body = querystring.stringify(postData);
					const path = '/0/private/EditOrder';
					const signature = crypto
						.createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'))
						.update(path + crypto.createHash('sha256').update(postData.nonce + body).digest())
						.digest('base64');

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteOrder': {
					const txid = this.getNodeParameter('txid', i) as string;

					const postData: any = {
						nonce: Date.now() * 1000,
						txid,
					};

					const body = querystring.stringify(postData);
					const path = '/0/private/CancelOrder';
					const signature = crypto
						.createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'))
						.update(path + crypto.createHash('sha256').update(postData.nonce + body).digest())
						.digest('base64');

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteAllOrders': {
					const postData: any = {
						nonce: Date.now() * 1000,
					};

					const body = querystring.stringify(postData);
					const path = '/0/private/CancelAll';
					const signature = crypto
						.createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'))
						.update(path + crypto.createHash('sha256').update(postData.nonce + body).digest())
						.digest('base64');

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'cancelAllAfter': {
					const timeout = this.getNodeParameter('timeout', i) as number;

					const postData: any = {
						nonce: Date.now() * 1000,
						timeout,
					};

					const body = querystring.stringify(postData);
					const path = '/0/private/CancelAllOrdersAfter';
					const signature = crypto
						.createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'))
						.update(path + crypto.createHash('sha256').update(postData.nonce + body).digest())
						.digest('base64');

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl + path,
						headers: {
							'API-Key': credentials.apiKey,
							'API-Sign': signature,
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeFundingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('krakenexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now() * 1000;
      let endpoint = '';
      let postData = `nonce=${nonce}`;

      switch (operation) {
        case 'getDepositMethods': {
          const asset = this.getNodeParameter('asset', i) as string;
          endpoint = '/private/DepositMethods';
          postData += `&asset=${asset}`;
          break;
        }
        case 'getDepositAddresses': {
          const asset = this.getNodeParameter('asset', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const generateNew = this.getNodeParameter('new', i) as boolean;
          endpoint = '/private/DepositAddresses';
          postData += `&asset=${asset}`;
          if (method) postData += `&method=${method}`;
          if (generateNew) postData += `&new=true`;
          break;
        }
        case 'getDepositStatus': {
          const asset = this.getNodeParameter('asset', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          endpoint = '/private/DepositStatus';
          postData += `&asset=${asset}`;
          if (method) postData += `&method=${method}`;
          break;
        }
        case 'getWithdrawalInfo': {
          const asset = this.getNodeParameter('asset', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          endpoint = '/private/WithdrawInfo';
          postData += `&asset=${asset}&key=${key}&amount=${amount}`;
          break;
        }
        case 'createWithdrawal': {
          const asset = this.getNodeParameter('asset', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          endpoint = '/private/Withdraw';
          postData += `&asset=${asset}&key=${key}&amount=${amount}`;
          break;
        }
        case 'getWithdrawalStatus': {
          const asset = this.getNodeParameter('asset', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          endpoint = '/private/WithdrawStatus';
          postData += `&asset=${asset}`;
          if (method) postData += `&method=${method}`;
          break;
        }
        case 'cancelWithdrawal': {
          const asset = this.getNodeParameter('asset', i) as string;
          const refid = this.getNodeParameter('refid', i) as string;
          endpoint = '/private/WithdrawCancel';
          postData += `&asset=${asset}&refid=${refid}`;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      const apiPath = `/0${endpoint}`;
      const message = apiPath + createHmac('sha256', postData, 'utf8').digest('hex');
      const signature = createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'))
        .update(message, 'utf8')
        .digest('base64');

      const options: any = {
        method: 'POST',
        url: `${credentials.baseUrl}${apiPath}`,
        headers: {
          'API-Key': credentials.apiKey,
          'API-Sign': signature,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData,
      };

      result = await this.helpers.httpRequest(options) as any;

      if (result.error && result.error.length > 0) {
        throw new NodeOperationError(this.getNode(), `Kraken API error: ${result.error.join(', ')}`);
      }

      returnData.push({
        json: result.result || result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeStakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('krakenexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now() * 1000;
      
      switch (operation) {
        case 'getStakingAssets': {
          const postData = `nonce=${nonce}`;
          const signature = this.helpers.createHmacSignature!(
            '/0/private/Staking/Assets' + postData,
            credentials.privateKey,
            'sha512',
            'base64'
          );
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.kraken.com/0'}/private/Staking/Assets`,
            headers: {
              'API-Key': credentials.apiKey,
              'API-Sign': signature,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPendingStaking': {
          const postData = `nonce=${nonce}`;
          const signature = this.helpers.createHmacSignature!(
            '/0/private/Staking/Pending' + postData,
            credentials.privateKey,
            'sha512',
            'base64'
          );
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.kraken.com/0'}/private/Staking/Pending`,
            headers: {
              'API-Key': credentials.apiKey,
              'API-Sign': signature,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getStakingTransactions': {
          const postData = `nonce=${nonce}`;
          const signature = this.helpers.createHmacSignature!(
            '/0/private/Staking/Transactions' + postData,
            credentials.privateKey,
            'sha512',
            'base64'
          );
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.kraken.com/0'}/private/Staking/Transactions`,
            headers: {
              'API-Key': credentials.apiKey,
              'API-Sign': signature,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createStake': {
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          
          let postData = `nonce=${nonce}&asset=${asset}&amount=${amount}`;
          if (method) {
            postData += `&method=${method}`;
          }
          
          const signature = this.helpers.createHmacSignature!(
            '/0/private/Stake' + postData,
            credentials.privateKey,
            'sha512',
            'base64'
          );
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.kraken.com/0'}/private/Stake`,
            headers: {
              'API-Key': credentials.apiKey,
              'API-Sign': signature,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createUnstake': {
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          
          let postData = `nonce=${nonce}&asset=${asset}&amount=${amount}`;
          if (method) {
            postData += `&method=${method}`;
          }
          
          const signature = this.helpers.createHmacSignature!(
            '/0/private/Unstake' + postData,
            credentials.privateKey,
            'sha512',
            'base64'
          );
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.kraken.com/0'}/private/Unstake`,
            headers: {
              'API-Key': credentials.apiKey,
              'API-Sign': signature,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeEarnOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('krakenexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const nonce = Date.now() * 1000;
      let postData = `nonce=${nonce}`;
      let endpoint = '';

      switch (operation) {
        case 'getEarnStrategies': {
          endpoint = '/private/Earn/Strategies';
          const asset = this.getNodeParameter('asset', i) as string;
          const cursor = this.getNodeParameter('cursor', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          
          if (asset) postData += `&asset=${asset}`;
          if (cursor) postData += `&cursor=${cursor}`;
          if (limit) postData += `&limit=${limit}`;
          break;
        }
        case 'getEarnAllocations': {
          endpoint = '/private/Earn/Allocations';
          const convertedAsset = this.getNodeParameter('convertedAsset', i) as string;
          const hideZeroAllocations = this.getNodeParameter('hideZeroAllocations', i) as boolean;
          
          if (convertedAsset) postData += `&converted_asset=${convertedAsset}`;
          if (hideZeroAllocations !== undefined) postData += `&hide_zero_allocations=${hideZeroAllocations}`;
          break;
        }
        case 'createEarnAllocation': {
          endpoint = '/private/Earn/AllocateEarnFunds';
          const strategyId = this.getNodeParameter('strategyId', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          
          postData += `&strategy_id=${strategyId}&amount=${amount}`;
          break;
        }
        case 'createEarnDeallocation': {
          endpoint = '/private/Earn/DeallocateEarnFunds';
          const strategyId = this.getNodeParameter('strategyId', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          
          postData += `&strategy_id=${strategyId}&amount=${amount}`;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      const crypto = require('crypto');
      const sha256Hash = crypto.createHash('sha256').update(endpoint + postData).digest();
      const hmac = crypto.createHmac('sha512', Buffer.from(credentials.privateKey, 'base64'));
      hmac.update(sha256Hash);
      const signature = hmac.digest('base64');

      const options: any = {
        method: 'POST',
        url: `${credentials.baseUrl}${endpoint}`,
        headers: {
          'API-Key': credentials.apiKey,
          'API-Sign': signature,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postData,
        json: true
      };

      result = await this.helpers.httpRequest(options) as any;
      
      if (result.error && result.error.length > 0) {
        throw new NodeApiError(this.getNode(), result, { message: result.error.join(', ') });
      }

      returnData.push({
        json: result.result || result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
