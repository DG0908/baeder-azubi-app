import {
  loadRetentionCandidates as dsLoadRetentionCandidates,
  purgeUserData as dsPurgeUserData,
} from './dataService';

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

const deleteUserData = async (userId, email, userName) => {
  try {
    await dsPurgeUserData(userId, userName);
    console.log(`Alle Daten für ${email} gelöscht`);
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
};

export const runDataRetentionCheck = async () => {
  try {
    const users = await dsLoadRetentionCandidates();

    if (!users || users.length === 0) {
      if (import.meta.env.DEV) console.log('No users found or Supabase error');
      return;
    }

    const now = Date.now();

    for (const account of users) {
      try {
        if (account.role === 'admin') continue;

        if (account.role === 'azubi' && account.training_end) {
          const endDate = new Date(account.training_end).getTime();
          if (now > endDate) {
            console.log(`Azubi ${account.name} Ausbildung beendet - Daten werden gelöscht`);
            await deleteUserData(account.id, account.email, account.name);
          }
        }

        if (account.role === 'trainer' && account.last_login) {
          const lastLoginDate = new Date(account.last_login).getTime();
          if (now - lastLoginDate > SIX_MONTHS_MS) {
            console.log(`Ausbilder ${account.name} 6 Monate inaktiv - Daten werden gelöscht`);
            await deleteUserData(account.id, account.email, account.name);
          }
        }
      } catch (e) {
        console.error('Error checking user:', e);
      }
    }
  } catch (error) {
    console.log('Data retention check skipped:', error.message);
  }
};
