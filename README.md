# n8n-nodes-kraken-exchange

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with Kraken cryptocurrency exchange. This node provides access to 6 core resources including market data, account management, trading operations, funding, staking, and earn services, enabling full automation of cryptocurrency trading and portfolio management workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Kraken Exchange](https://img.shields.io/badge/Kraken-Exchange-purple)
![Crypto Trading](https://img.shields.io/badge/Crypto-Trading-orange)
![Market Data](https://img.shields.io/badge/Market-Data-green)

## Features

- **Real-time Market Data** - Access live prices, order books, trades, and OHLC data for all Kraken trading pairs
- **Account Management** - Retrieve balances, trade history, open orders, and account status information
- **Advanced Trading** - Execute market and limit orders, cancel orders, and manage positions with full order lifecycle control
- **Funding Operations** - Deposit and withdraw funds, check transfer status, and manage funding methods
- **Staking Services** - Stake supported cryptocurrencies and manage staking rewards and positions
- **Earn Programs** - Access Kraken's earn products for yield generation on cryptocurrency holdings
- **Comprehensive Error Handling** - Detailed error messages and status codes for robust workflow management
- **Type-safe Operations** - Full TypeScript support with validated inputs and outputs

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-kraken-exchange`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-kraken-exchange
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-kraken-exchange.git
cd n8n-nodes-kraken-exchange
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-kraken-exchange
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Kraken API key from account settings | Yes |
| Private Key | Your Kraken private key for signing requests | Yes |
| Sandbox | Enable for testing with Kraken's sandbox environment | No |

## Resources & Operations

### 1. Market Data

| Operation | Description |
|-----------|-------------|
| Get Server Time | Retrieve current server time and system status |
| Get System Status | Check Kraken system status and availability |
| Get Asset Info | Get information about available assets |
| Get Tradable Asset Pairs | Retrieve tradable asset pair information |
| Get Ticker Information | Get ticker data for specified asset pairs |
| Get OHLC Data | Retrieve OHLC (candlestick) data for asset pairs |
| Get Order Book | Get current order book for asset pairs |
| Get Recent Trades | Retrieve recent trades for asset pairs |
| Get Recent Spreads | Get recent spread data for asset pairs |

### 2. Account

| Operation | Description |
|-----------|-------------|
| Get Account Balance | Retrieve current account balances for all assets |
| Get Extended Balance | Get detailed balance information including hold amounts |
| Get Trade Balance | Retrieve trade balance and margin information |
| Get Open Orders | List all currently open orders |
| Get Closed Orders | Retrieve closed order history with filtering options |
| Query Orders Info | Get detailed information about specific orders |
| Get Trades History | Retrieve trade execution history |
| Query Trades Info | Get detailed information about specific trades |
| Get Open Positions | List all open margin positions |
| Get Ledgers Info | Retrieve ledger information for account activity |
| Query Ledgers | Get detailed ledger entries with filtering |
| Get Trade Volume | Retrieve current trading fee schedule and volume |
| Request Export Report | Request export of account data |
| Get Export Report Status | Check status of requested export reports |
| Retrieve Export Report | Download completed export reports |
| Delete Export Report | Remove completed export reports |

### 3. Trading

| Operation | Description |
|-----------|-------------|
| Add Order | Place new market or limit orders |
| Add Order Batch | Place multiple orders in a single request |
| Edit Order | Modify existing open orders |
| Cancel Order | Cancel specific open orders |
| Cancel All Orders | Cancel all open orders |
| Cancel All Orders After | Set automatic order cancellation timer |
| Cancel Order Batch | Cancel multiple orders in a single request |

### 4. Funding

| Operation | Description |
|-----------|-------------|
| Get Deposit Methods | Retrieve available deposit methods for assets |
| Get Deposit Addresses | Get deposit addresses for assets |
| Get Deposit Status | Check status of recent deposits |
| Get Withdrawal Information | Get withdrawal information for assets |
| Withdraw Funds | Initiate cryptocurrency or fiat withdrawals |
| Get Withdrawal Status | Check status of recent withdrawals |
| Cancel Withdrawal | Cancel pending withdrawals |
| Wallet Transfer | Transfer funds between Kraken accounts |

### 5. Staking

| Operation | Description |
|-----------|-------------|
| Stake Asset | Initiate staking for supported assets |
| Unstake Asset | Remove assets from staking |
| List Stakeable Assets | Get list of assets available for staking |
| Get Pending Staking Transactions | Retrieve pending staking operations |
| List Staking Transactions | Get history of staking transactions |

### 6. Earn

| Operation | Description |
|-----------|-------------|
| Allocate Earn Funds | Allocate funds to earn strategies |
| Deallocate Earn Funds | Remove funds from earn strategies |
| Get Allocation Status | Check status of earn allocations |
| List Earn Strategies | Get available earn strategies and rates |
| List Earn Allocations | Retrieve current earn positions |

## Usage Examples

```javascript
// Get current Bitcoin price
{
  "pair": "XBTUSD",
  "operation": "getTicker"
}
```

```javascript
// Place a limit buy order for Ethereum
{
  "pair": "ETHUSD",
  "type": "buy",
  "ordertype": "limit",
  "volume": "1.0",
  "price": "2000.00"
}
```

```javascript
// Check account balances
{
  "operation": "getAccountBalance"
}
```

```javascript
// Stake Ethereum for rewards
{
  "asset": "ETH",
  "amount": "5.0",
  "method": "ethereum-staked"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | API credentials are incorrect or missing | Verify API key and private key in credentials |
| Insufficient Funds | Account balance too low for operation | Check account balance and reduce order size |
| Invalid Asset Pair | Specified trading pair doesn't exist | Use Get Tradable Asset Pairs to verify pair names |
| Rate Limit Exceeded | Too many requests sent to API | Implement delays between requests or reduce frequency |
| Order Not Found | Specified order ID doesn't exist | Verify order ID or check if order was already executed |
| Market Closed | Trading pair temporarily unavailable | Check system status or try again later |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-kraken-exchange/issues)
- **Kraken API Documentation**: [docs.kraken.com](https://docs.kraken.com/rest/)
- **Kraken Support**: [support.kraken.com](https://support.kraken.com)