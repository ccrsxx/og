import { describe, expect, it, vi } from 'vitest';

// Mock satori — third-party rendering library (equivalent to mocking an HTTP client in Go).
vi.mock('satori', () => ({
  default: vi.fn().mockResolvedValue('<svg>mock</svg>')
}));

// Mock resvg — third-party PNG converter. Must be a class since it's instantiated with `new`.
vi.mock('@resvg/resvg-js', () => ({
  Resvg: class MockResvg {
    render(): { asPng: () => Buffer } {
      return {
        asPng: () => Buffer.from('fake-png-data')
      };
    }
  }
}));

// Mock satori-html — template engine.
vi.mock('satori-html', () => ({
  html: vi.fn().mockReturnValue({ type: 'div', props: {} })
}));

import { OgService, loadFonts } from './og.service.ts';

function createOgService(): OgService {
  const fonts = [new ArrayBuffer(8), new ArrayBuffer(8), new ArrayBuffer(8)];

  return new OgService({
    fonts,
    cloudflareCdnUrl: 'https://cdn.example.com'
  });
}

describe('loadFonts', () => {
  it('fetches three font files and returns ArrayBuffers', async () => {
    const mockArrayBuffer = new ArrayBuffer(16);

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    } as Response);

    const fonts = await loadFonts('https://cdn.example.com');

    expect(fonts).toHaveLength(3);

    fonts.forEach((font) => {
      expect(font).toBe(mockArrayBuffer);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cdn.example.com/assets/inter-regular.ttf'
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cdn.example.com/assets/inter-medium.ttf'
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cdn.example.com/assets/inter-semibold.ttf'
    );

    fetchSpy.mockRestore();
  });
});

describe('OgService', () => {
  describe('getOg', () => {
    it('generates a png buffer for default layout', async () => {
      const service = createOgService();

      const result = await service.getOg({ title: 'Hello World' });

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('generates article layout when article param is present', async () => {
      const service = createOgService();

      const result = await service.getOg({
        title: 'My Article',
        article: 'true',
        type: 'blog',
        description: 'A test article'
      });

      expect(result).toBeInstanceOf(Buffer);
    });

    it('uses emilia image url when no image provided', async () => {
      const { html } = await import('satori-html');

      const service = createOgService();

      await service.getOg({ article: 'true', title: 'No Image' });

      const htmlMock = vi.mocked(html);

      // Get the first argument of the last call to html() — the generated markup string.
      const calledWith = htmlMock.mock.calls.at(-1)?.[0] as string;

      expect(calledWith).toContain('https://cdn.example.com/assets/emilia.png');
    });

    it('handles empty query params gracefully', async () => {
      const service = createOgService();

      const result = await service.getOg({});

      expect(result).toBeInstanceOf(Buffer);
    });

    it('uses homepage layout when title is Risal Amin', async () => {
      const { html } = await import('satori-html');

      const service = createOgService();

      await service.getOg({ title: 'Risal Amin' });

      const htmlMock = vi.mocked(html);
      const calledWith = htmlMock.mock.calls.at(-1)?.[0] as string;

      expect(calledWith).toContain('Risal Amin');
      expect(calledWith).not.toContain('risalamin.com</p>');
    });

    it('falls back to defaults when query validation fails', async () => {
      const service = createOgService();

      // Pass invalid types to trigger safeParse failure (data ?? {}).
      const result = await service.getOg({ title: ['array', 'not', 'string'] });

      expect(result).toBeInstanceOf(Buffer);
    });
  });
});
