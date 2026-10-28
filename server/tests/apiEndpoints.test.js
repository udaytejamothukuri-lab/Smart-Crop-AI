import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('SmartCrop AI - REST API Endpoints Integration Tests', () => {

  test('GET /api/health -> returns status 200 and system details', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.ok(res.body.uptime >= 0);
    assert.ok(res.body.database);
    assert.ok(res.body.methodVersion);
  });

  test('GET /api/crops -> returns list of supported crops and requirements', async () => {
    const res = await request(app).get('/api/crops');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.count >= 10);
    assert.ok(Array.isArray(res.body.crops));
    assert.ok(res.body.supportedSoilTypes.length > 0);
    assert.ok(res.body.supportedSeasons.length > 0);
  });

  test('POST /api/recommendations -> successful recommendation generation', async () => {
    const payload = {
      soilType: 'clay-loam',
      season: 'kharif',
      temperature: 28,
      rainfall: 1200,
      ph: 6.5,
      humidity: 75,
      nitrogen: 120,
      phosphorus: 30,
      potassium: 40
    };

    const res = await request(app)
      .post('/api/recommendations')
      .send(payload);

    assert.ok(res.status === 200 || res.status === 201);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.recommendations));
    assert.ok(res.body.recommendations.length > 0);
    assert.ok(res.body.advisory);
    assert.ok(res.body.methodVersion);
  });

  test('POST /api/recommendations -> rejects invalid pH (> 14)', async () => {
    const payload = {
      soilType: 'clay',
      season: 'kharif',
      ph: 16.5 // Invalid
    };

    const res = await request(app)
      .post('/api/recommendations')
      .send(payload);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.validationErrors.some(e => e.includes('pH')));
  });

  test('POST /api/recommendations -> rejects empty payload', async () => {
    const res = await request(app)
      .post('/api/recommendations')
      .send({});

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('POST /api/recommendations/compare -> valid comparison of two crops', async () => {
    const payload = {
      cropIds: ['rice', 'wheat'],
      inputProfile: {
        soilType: 'clay-loam',
        season: 'kharif',
        temperature: 26,
        rainfall: 1100,
        ph: 6.5,
        humidity: 75
      }
    };

    const res = await request(app)
      .post('/api/recommendations/compare')
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.cropsCount, 2);
    assert.ok(Array.isArray(res.body.comparisons));

    const rice = res.body.comparisons.find(c => c.cropId === 'rice');
    const wheat = res.body.comparisons.find(c => c.cropId === 'wheat');

    assert.ok(rice);
    assert.ok(wheat);
    assert.ok(rice.soilCompatibility);
    assert.ok(wheat.seasonCompatibility);
  });

  test('POST /api/recommendations/compare -> rejects when fewer than 2 cropIds provided', async () => {
    const payload = {
      cropIds: ['rice'],
      inputProfile: { soilType: 'clay' }
    };

    const res = await request(app)
      .post('/api/recommendations/compare')
      .send(payload);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('GET /api/recommendations/:id -> rejects malformed MongoDB ObjectId', async () => {
    const res = await request(app).get('/api/recommendations/invalid-id-123');
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('Invalid recommendation identifier'));
  });

  test('DELETE /api/recommendations/:id -> rejects malformed MongoDB ObjectId', async () => {
    const res = await request(app).delete('/api/recommendations/invalid-id-xyz');
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('GET /unknown-route -> 404 handler returns structured JSON', async () => {
    const res = await request(app).get('/unknown-endpoint');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Endpoint Not Found');
  });

});
