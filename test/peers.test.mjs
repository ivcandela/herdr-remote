import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePeer, splitPeerPath, forwardSearch } from '../peers.mjs';

test('parsePeer reads name=url', () => {
  assert.deepEqual(parsePeer('travel=http://192.168.1.30:4270/'), { name: 'travel', url: 'http://192.168.1.30:4270' });
});

test('parsePeer rejects malformed specs', () => {
  for (const bad of ['travel', '=http://a', 'a b=http://x', 'a=ftp://x', 'a=nonsense', undefined]) {
    assert.equal(parsePeer(bad), null, String(bad));
  }
});

test('splitPeerPath only proxies the API', () => {
  assert.deepEqual(splitPeerPath('/h/travel/api/overview'), { name: 'travel', path: '/api/overview' });
  assert.deepEqual(splitPeerPath('/h/a%20b/api/agents/x%3A1/stream'), { name: 'a b', path: '/api/agents/x%3A1/stream' });
  assert.equal(splitPeerPath('/h/travel/index.html'), null);
  assert.equal(splitPeerPath('/h/travel'), null);
  assert.equal(splitPeerPath('/api/overview'), null);
});

test('forwardSearch drops the client token and keeps the rest', () => {
  assert.equal(forwardSearch('?format=text&token=secret'), '?format=text');
  assert.equal(forwardSearch('?token=secret'), '');
  assert.equal(forwardSearch(''), '');
});
