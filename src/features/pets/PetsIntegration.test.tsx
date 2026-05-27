import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../home/HomePage';
import { PetDetailPage } from './PetDetailPage';
import { renderWithProviders } from '../../test-utils';
import { server } from '../../mocks/server';

describe('Pets Integration', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('renders pets list fetched from API', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Doggie')).toBeInTheDocument();
      expect(screen.getByText('Kitty')).toBeInTheDocument();
    });

    const availableElements = screen.getAllByText('available');
    expect(availableElements.length).toBeGreaterThan(0);
  });

  describe('PetDetailPage', () => {
    function renderPetDetail(petId: string) {
      return renderWithProviders(
        <Routes>
          <Route path="/pets/:petId" element={<PetDetailPage />} />
        </Routes>,
        { initialEntries: [`/pets/${petId}`] },
      );
    }

    it('renders pet detail with name', async () => {
      renderPetDetail('1');

      await waitFor(() => {
        expect(screen.getByText('Doggie')).toBeInTheDocument();
      });
    });

    it('renders carousel with prev/next buttons when pet has multiple photoUrls', async () => {
      server.use(
        http.get('*/pet/:petId', () => {
          return HttpResponse.json({
            id: 1,
            name: 'MultiPhotoPet',
            status: 'available',
            photoUrls: ['https://example.com/1.jpg', 'https://example.com/2.jpg', 'https://example.com/3.jpg'],
          });
        }),
      );

      renderPetDetail('1');

      await waitFor(() => {
        expect(screen.getByText('MultiPhotoPet')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    });

    it('renders dot indicators for carousel when multiple photos', async () => {
      server.use(
        http.get('*/pet/:petId', () => {
          return HttpResponse.json({
            id: 1,
            name: 'DotPet',
            status: 'available',
            photoUrls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
          });
        }),
      );

      renderPetDetail('1');

      await waitFor(() => {
        expect(screen.getByText('DotPet')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Image 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Image 2')).toBeInTheDocument();
    });
  });
});
