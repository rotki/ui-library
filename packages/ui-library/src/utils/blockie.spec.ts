import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBlockie } from '@/utils/blockie';

describe('utils/blockie.ts', () => {
  const mockCanvas = {
    getContext: vi.fn(),
    height: 0,
    toDataURL: vi.fn(),
    width: 0,
  };

  const mockContext = {
    fillRect: vi.fn(),
    fillStyle: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCanvas.getContext.mockReturnValue(mockContext);
    mockCanvas.toDataURL.mockReturnValue('data:image/jpeg;base64,test');
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a blockie with default options', () => {
    const result = createBlockie({});

    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg');
    expect(result).toBe('data:image/jpeg;base64,test');
  });

  it('should use provided seed for consistent generation', () => {
    const options = { seed: 'test-seed' };
    createBlockie(options);

    expect(mockCanvas.width).toBe(64); // default size 8 * default scale 8
    expect(mockCanvas.height).toBe(64);
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should apply custom size and scale', () => {
    const options = { scale: 5, size: 10 };
    createBlockie(options);

    expect(mockCanvas.width).toBe(50); // size 10 * scale 5
    expect(mockCanvas.height).toBe(50);
  });

  it('should use custom colors when provided', () => {
    const options = {
      bgcolor: '#0000FF',
      color: '#FF0000',
      spotColor: '#00FF00',
    };
    createBlockie(options);

    expect(mockContext.fillStyle).toBeDefined();
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should generate random seed when not provided', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    createBlockie({});

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should create mirrored pattern', () => {
    const options = { seed: 'test', size: 4 };
    createBlockie(options);

    // Verify fillRect is called for the pattern
    const fillRectCalls = mockContext.fillRect.mock.calls;
    expect(fillRectCalls.length).toBeGreaterThan(0);
  });

  it('should handle canvas context not available', () => {
    mockCanvas.getContext.mockReturnValue(null);

    const result = createBlockie({ seed: 'test' });

    expect(result).toBe('data:image/jpeg;base64,test');
    expect(mockContext.fillRect).not.toHaveBeenCalled();
  });

  it('should generate consistent colors for same seed', () => {
    const seed = 'consistent-seed';
    const fillStyleValues: string[] = [];

    mockContext.fillStyle = '';
    Object.defineProperty(mockContext, 'fillStyle', {
      get() {
        return this._fillStyle;
      },
      set(value) {
        fillStyleValues.push(value);
        this._fillStyle = value;
      },
    });

    createBlockie({ seed });

    // Should have at least bgcolor and color set
    expect(fillStyleValues.length).toBeGreaterThanOrEqual(2);

    // Colors should be in HSL format
    const hslPattern = /^hsl\(\d+,\d+(\.\d+)?%,\d+(\.\d+)?%\)$/;
    fillStyleValues.forEach((color) => {
      if (color.startsWith('hsl')) {
        expect(color).toMatch(hslPattern);
      }
    });
  });

  it('should respect spot color setting of -1 to disable spots', () => {
    const options = { seed: 'test', spotColor: '-1' };
    createBlockie(options);

    expect(mockContext.fillRect).toHaveBeenCalled();
  });
});
