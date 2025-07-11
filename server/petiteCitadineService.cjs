const { Pool } = require('pg');

class PetiteCitadineService {
  constructor(pool) {
    this.pool = pool;
  }

  // Création de la table formules_petite_citadine si elle n'existe pas
  async createTable() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS formules_petite_citadine (
          id SERIAL PRIMARY KEY,
          nom VARCHAR(100) NOT NULL,
          prix DECIMAL(10,2) NOT NULL,
          duree VARCHAR(50) NOT NULL,
          icone VARCHAR(50) NOT NULL,
          services TEXT[] NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Table formules_petite_citadine créée avec succès');
    } catch (err) {
      console.error('❌ Erreur lors de la création de la table formules_petite_citadine:', err);
      throw err;
    }
  }

  // Récupérer toutes les formules petite citadine
  async getAllFormules() {
    try {
      const result = await this.pool.query('SELECT * FROM formules_petite_citadine ORDER BY created_at DESC');
      return result.rows;
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des formules:', err);
      throw err;
    }
  }

  // Ajouter une nouvelle formule petite citadine
  async addFormule(formuleData) {
    try {
      const { nom, prix, duree, icone, services } = formuleData;

      // Validation des données
      if (!nom || !prix || !duree || !icone || !services || !Array.isArray(services)) {
        throw new Error('Tous les champs sont requis et services doit être un tableau');
      }

      const result = await this.pool.query(
        'INSERT INTO formules_petite_citadine (nom, prix, duree, icone, services) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nom, prix, duree, icone, services]
      );

      console.log(`✅ Formule "${nom}" ajoutée avec succès`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de l\'ajout de la formule:', err);
      throw err;
    }
  }

  // Supprimer une formule petite citadine
  async deleteFormule(id) {
    try {
      const result = await this.pool.query('DELETE FROM formules_petite_citadine WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Formule non trouvée');
      }

      console.log(`✅ Formule ID ${id} supprimée avec succès`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de la formule:', err);
      throw err;
    }
  }

  // Mettre à jour une formule petite citadine
  async updateFormule(id, formuleData) {
    try {
      const { nom, prix, duree, icone, services } = formuleData;

      // Validation des données
      if (!nom || !prix || !duree || !icone || !services || !Array.isArray(services)) {
        throw new Error('Tous les champs sont requis et services doit être un tableau');
      }

      const result = await this.pool.query(
        'UPDATE formules_petite_citadine SET nom = $1, prix = $2, duree = $3, icone = $4, services = $5 WHERE id = $6 RETURNING *',
        [nom, prix, duree, icone, services, id]
      );

      if (result.rows.length === 0) {
        throw new Error('Formule non trouvée');
      }

      console.log(`✅ Formule ID ${id} mise à jour avec succès`);
      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour de la formule:', err);
      throw err;
    }
  }

  // Obtenir une formule par ID
  async getFormuleById(id) {
    try {
      const result = await this.pool.query('SELECT * FROM formules_petite_citadine WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Formule non trouvée');
      }

      return result.rows[0];
    } catch (err) {
      console.error('❌ Erreur lors de la récupération de la formule:', err);
      throw err;
    }
  }

  // Obtenir le nombre total de formules
  async getFormulesCount() {
    try {
      const result = await this.pool.query('SELECT COUNT(*) FROM formules_petite_citadine');
      return parseInt(result.rows[0].count);
    } catch (err) {
      console.error('❌ Erreur lors du comptage des formules:', err);
      throw err;
    }
  }
}

module.exports = PetiteCitadineService; 