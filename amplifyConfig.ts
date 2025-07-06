// If placing in src:
// src/amplifyConfig.ts
import { Amplify } from 'aws-amplify';
import config from './src/amplifyconfiguration.json'; // Adjust the path if necessary

Amplify.configure(config);