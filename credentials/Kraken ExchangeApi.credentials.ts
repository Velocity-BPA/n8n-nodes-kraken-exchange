import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KrakenExchangeApi implements ICredentialType {
	name = 'krakenExchangeApi';
	displayName = 'Kraken Exchange API';
	documentationUrl = 'https://docs.kraken.com/rest/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API Key from your Kraken account',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The Private Key from your Kraken account',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.kraken.com/0',
			required: true,
			description: 'The base URL for Kraken API',
		},
	];
}