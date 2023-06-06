import * as teamService from 'services/team';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth, db } from 'config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import { Team } from 'interfaces/team';
import { onAuthStateChanged } from 'firebase/auth';

const authContext = createContext({ team: {} as Team });
const { Provider } = authContext;

// TeamProvider is a Context Provider that wraps our app and makes an team object
// available to any child component that calls the useTeam() hook.
export function TeamProvider(props: { children: ReactNode }): JSX.Element {
  const team = useTeamProvider();
  return <Provider value={team}>{props.children}</Provider>;
}

// useTeam is a hook that enables any component to subscribe to team state
export const useTeam = () => {
  return useContext(authContext);
};

// Provider hook that creates team object and handles state
const useTeamProvider = () => {
  const [team, setTeam] = useState(null);

  const getAndSetTeam = async (teamId: string) => {
    const team = await teamService.getTeam(teamId);
    setTeam(team);
  };

  useEffect(() => {
    // Subscribe to auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid && !team) {
        /// We need to get the team data from the db
        onSnapshot(doc(db, 'users', user.uid), async (doc) => {
          const teamId = doc.data()?.teamId;
          if (teamId) {
            getAndSetTeam(teamId);
          }
        });
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Subscribe to team on mount
    if (team?.id) {
      onSnapshot(doc(db, 'teams', team.id), (doc) => {
        if (doc.exists()) {
          setTeam(doc.data());
        } else {
          console.log('No such document!');
        }
      });
    }
  }, [team?.id]);

  return {
    team,
  };
};
