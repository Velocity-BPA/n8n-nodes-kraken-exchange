/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { KrakenExchange } from '../nodes/Kraken Exchange/Kraken Exchange.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('KrakenExchange Node', () => {
  let node: KrakenExchange;

  beforeAll(() => {
    node = new KrakenExchange();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Kraken Exchange');
      expect(node.description.name).toBe('krakenexchange');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('MarketData Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.kraken.com/0' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	test('should get server time successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getServerTime');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { unixtime: 1688123456, rfc1123: 'Fri, 30 Jun 2023 12:30:56 +0000' }
		});

		const result = await executeMarketDataOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.unixtime).toBe(1688123456);
	});

	test('should handle getServerTime error', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getServerTime');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(
			new Error('API Error')
		);
		mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

		const result = await executeMarketDataOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	test('should get system status successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSystemStatus');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { status: 'online', timestamp: '2023-06-30T12:30:56Z' }
		});

		const result = await executeMarketDataOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.status).toBe('online');
	});

	test('should get assets successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAssets')
			.mockReturnValueOnce('XXBT,ZUSD')
			.mockReturnValueOnce('currency');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { XXBT: { aclass: 'currency', altname: 'XBT' } }
		});

		const result = await executeMarketDataOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.XXBT).toBeDefined();
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				qs: { asset: 'XXBT,ZUSD', aclass: 'currency' }
			})
		);
	});

	test('should get ticker successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTicker')
			.mockReturnValueOnce('XBTUSD');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { XXBTZUSD: { a: ['30000.00000'], b: ['29999.00000'] } }
		});

		const result = await executeMarketDataOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.XXBTZUSD).toBeDefined();
	});

	test('should get OHLC data successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getOHLC')
			.mockReturnValueOnce('XBTUSD')
			.mockReturnValueOnce('60')
			.mockReturnValueOnce('1688123456');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { 
				XXBTZUSD: [[1688123456, '30000.0', '30100.0', '29900.0', '30050.0', '30025.0', '1.5', 10]],
				last: 1688123456
			}
		});

		const result = await executeMarketDataOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.XXBTZUSD).toBeDefined();
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				qs: { pair: 'XBTUSD', interval: '60', since: '1688123456' }
			})
		);
	});

	test('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('unknownOperation');

		await expect(
			executeMarketDataOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			)
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Account Resource', () => {
	let mockExecuteFunctions: any;
	
	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				privateKey: 'test-private-key',
				baseUrl: 'https://api.kraken.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
			generateSignature: jest.fn().mockReturnValue('mock-signature'),
		};
	});

	it('should get account balance successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountBalance');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { ZUSD: '1000.0000' } });

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ result: { ZUSD: '1000.0000' } });
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAccountBalance');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should get trade balance with asset parameter', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTradeBalance')
			.mockReturnValueOnce('ZUSD');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { eb: '1000.0000' } });

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ result: { eb: '1000.0000' } });
	});

	it('should query orders with parameters', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('queryOrders')
			.mockReturnValueOnce(true)
			.mockReturnValueOnce('12345')
			.mockReturnValueOnce('OQCLML-BW3P3-BUCMWZ');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: {} });

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ result: {} });
	});
});

describe('Trading Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				privateKey: 'test-private-key',
				baseUrl: 'https://api.kraken.com/0'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should create order successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createOrder')
			.mockReturnValueOnce('XBTUSD')
			.mockReturnValueOnce('buy')
			.mockReturnValueOnce('market')
			.mockReturnValueOnce('1.0');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { txid: ['ORDER123'] }
		});

		const result = await executeTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.txid).toContain('ORDER123');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.kraken.com/0/0/private/AddOrder',
			})
		);
	});

	test('should handle create order error', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createOrder')
			.mockReturnValueOnce('XBTUSD')
			.mockReturnValueOnce('buy')
			.mockReturnValueOnce('market')
			.mockReturnValueOnce('1.0');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

		const result = await executeTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	test('should delete order successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteOrder')
			.mockReturnValueOnce('ORDER123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { count: 1 }
		});

		const result = await executeTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.count).toBe(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.kraken.com/0/0/private/CancelOrder',
			})
		);
	});

	test('should cancel all orders after timeout successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('cancelAllAfter')
			.mockReturnValueOnce(60);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
			error: [],
			result: { currentTime: '2023-01-01T00:00:00Z', triggerTime: '2023-01-01T00:01:00Z' }
		});

		const result = await executeTradingOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.triggerTime).toBe('2023-01-01T00:01:00Z');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://api.kraken.com/0/0/private/CancelAllOrdersAfter',
			})
		);
	});
});

describe('Funding Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        privateKey: 'dGVzdC1wcml2YXRlLWtleQ==',
        baseUrl: 'https://api.kraken.com/0'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  test('should get deposit methods successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getDepositMethods')
      .mockReturnValueOnce('BTC');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      error: [],
      result: [{ method: 'Bitcoin', limit: false, fee: '0.0001' }]
    });

    const result = await executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual([{ method: 'Bitcoin', limit: false, fee: '0.0001' }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.kraken.com/0/private/DepositMethods',
      })
    );
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getDepositMethods')
      .mockReturnValueOnce('INVALID');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      error: ['EAsset:Unknown asset'],
      result: null
    });

    await expect(executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Kraken API error: EAsset:Unknown asset');
  });

  test('should create withdrawal successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createWithdrawal')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce('mykey')
      .mockReturnValueOnce('0.1');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      error: [],
      result: { refid: 'ABC123' }
    });

    const result = await executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ refid: 'ABC123' });
  });

  test('should handle network errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getDepositMethods')
      .mockReturnValueOnce('BTC');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const result = await executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network error' });
  });
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        privateKey: 'test-private-key',
        baseUrl: 'https://api.kraken.com/0' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        createHmacSignature: jest.fn().mockReturnValue('test-signature')
      },
    };
  });

  it('should get staking assets successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getStakingAssets');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { assets: [] } });

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ result: { assets: [] } });
  });

  it('should create stake successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createStake')
      .mockReturnValueOnce('DOT')
      .mockReturnValueOnce('100')
      .mockReturnValueOnce('auto');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ result: { refid: 'stake123' } });

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ result: { refid: 'stake123' } });
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getStakingAssets');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Earn Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        privateKey: 'dGVzdC1wcml2YXRlLWtleQ==',
        baseUrl: 'https://api.kraken.com/0'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn().mockResolvedValue({ 
          result: { strategies: [] }
        })
      },
    };
  });

  it('should get earn strategies successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEarnStrategies')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(10);

    const items = [{ json: {} }];
    const result = await executeEarnOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.kraken.com/0/private/Earn/Strategies',
        headers: expect.objectContaining({
          'API-Key': 'test-key'
        })
      })
    );
  });

  it('should get earn allocations successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEarnAllocations')
      .mockReturnValueOnce('USD')
      .mockReturnValueOnce(true);

    const items = [{ json: {} }];
    const result = await executeEarnOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
  });

  it('should create earn allocation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createEarnAllocation')
      .mockReturnValueOnce('strategy123')
      .mockReturnValueOnce('100.0');

    const items = [{ json: {} }];
    const result = await executeEarnOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://api.kraken.com/0/private/Earn/AllocateEarnFunds'
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEarnStrategies');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

    const items = [{ json: {} }];
    const result = await executeEarnOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});
});
