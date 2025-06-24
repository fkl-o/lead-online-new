import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/relaunch-lo';
    console.log('Verbinde mit MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB verbunden...');
  } catch (error) {
    console.error('Fehler beim Verbinden mit MongoDB:', error.message);
    process.exit(1);
  }
};

const fixUserRoles = async () => {
  try {
    await connectDB();

    // Direkte MongoDB-Abfrage ohne Schema-Validierung
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Finde alle Benutzer mit ungültigen Rollen
    const invalidUsers = await usersCollection.find({
      role: { $nin: ['admin', 'vertrieb', 'kunde', 'lead'] }
    }).toArray();

    console.log(`Gefunden ${invalidUsers.length} Benutzer mit ungültigen Rollen:`);
    
    invalidUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}): Rolle "${user.role}"`);
    });

    if (invalidUsers.length > 0) {
      // Aktualisiere alle Benutzer mit der Rolle 'user' auf 'kunde'
      const result = await usersCollection.updateMany(
        { role: 'user' },
        { $set: { role: 'kunde' } }
      );

      console.log(`\n${result.modifiedCount} Benutzer wurden von 'user' auf 'kunde' aktualisiert.`);

      // Aktualisiere andere ungültige Rollen
      const otherInvalidRoles = await usersCollection.updateMany(
        { role: { $nin: ['admin', 'vertrieb', 'kunde', 'lead'] } },
        { $set: { role: 'lead' } }
      );

      console.log(`${otherInvalidRoles.modifiedCount} Benutzer mit anderen ungültigen Rollen wurden auf 'lead' gesetzt.`);
    }

    // Überprüfe das Ergebnis
    const remainingInvalid = await usersCollection.find({
      role: { $nin: ['admin', 'vertrieb', 'kunde', 'lead'] }
    }).toArray();

    if (remainingInvalid.length === 0) {
      console.log('\n✅ Alle Benutzerrollen wurden erfolgreich korrigiert!');
    } else {
      console.log(`\n⚠️  Es verbleiben ${remainingInvalid.length} Benutzer mit ungültigen Rollen.`);
    }

  } catch (error) {
    console.error('Fehler beim Korrigieren der Benutzerrollen:', error);
  } finally {
    mongoose.connection.close();
    console.log('Datenbankverbindung geschlossen.');
  }
};

// Script ausführen
fixUserRoles();
