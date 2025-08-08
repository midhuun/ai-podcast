import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TopicScriptor E2E Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /generate-script', () => {
    it('should generate script content for valid topic', async () => {
      const topic = 'History of artificial intelligence';
      
      const response = await request(app.getHttpServer())
        .post('/generate-script')
        .send({ topic })
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('explanation');
      expect(response.body).toHaveProperty('script');
      
      expect(typeof response.body.summary).toBe('string');
      expect(typeof response.body.explanation).toBe('string');
      expect(typeof response.body.script).toBe('string');
      
      expect(response.body.summary.length).toBeGreaterThan(0);
      expect(response.body.explanation.length).toBeGreaterThan(0);
      expect(response.body.script.length).toBeGreaterThan(0);
    }, 30000); // 30 second timeout for AI response

    it('should reject empty topic', async () => {
      await request(app.getHttpServer())
        .post('/generate-script')
        .send({ topic: '' })
        .expect(400);
    });

    it('should reject topic that is too short', async () => {
      await request(app.getHttpServer())
        .post('/generate-script')
        .send({ topic: 'AI' })
        .expect(400);
    });

    it('should reject topic that is too long', async () => {
      const longTopic = 'A'.repeat(501);
      
      await request(app.getHttpServer())
        .post('/generate-script')
        .send({ topic: longTopic })
        .expect(400);
    });

    it('should reject request without topic field', async () => {
      await request(app.getHttpServer())
        .post('/generate-script')
        .send({})
        .expect(400);
    });

    it('should reject non-string topic', async () => {
      await request(app.getHttpServer())
        .post('/generate-script')
        .send({ topic: 123 })
        .expect(400);
    });

    it('should handle different valid topic formats', async () => {
      const topics = [
        'Business strategy',
        'Climate change impacts on agriculture',
        'The evolution of programming languages',
        'Modern art movements in the 20th century'
      ];

      for (const topic of topics) {
        const response = await request(app.getHttpServer())
          .post('/generate-script')
          .send({ topic })
          .expect(200);

        expect(response.body).toHaveProperty('summary');
        expect(response.body).toHaveProperty('explanation');
        expect(response.body).toHaveProperty('script');
      }
    }, 60000); // Longer timeout for multiple requests
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      await request(app.getHttpServer())
        .post('/non-existent-endpoint')
        .send({ topic: 'test' })
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/generate-script')
        .send('invalid json')
        .expect(400);
    });
  });
});