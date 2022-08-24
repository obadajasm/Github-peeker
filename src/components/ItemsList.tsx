import { memo } from "react";
import { Repository } from "../models/repository";
import { User } from "../models/user";
import { useAppSelector } from "../store/hooks";
import Card from "./Card";
import Loading from "./Loading";

const ItemsList = ({ type, loader, shouldShow }:
  { type: 'users' | 'repos', loader: React.RefObject<HTMLDivElement>, shouldShow: boolean }) => {

  const typeItem = useAppSelector((state) => state.github[type]) ?? null;
  const status = useAppSelector((state) => state.github.status) ?? null;
  const isLoading = status === 'loading';
  let items = typeItem?.items ?? [];
  let DisplayedCard: any;

  if (type === 'users') {
    DisplayedCard = (e: User) => <Card key={e.id} title={e.login} imgSrc={e.avatar_url} />
  } else {
    DisplayedCard = (e: Repository) => (
      <Card
        key={e.id}
        title={e.name}
        secondary={e.owner.login}
        info={{
          'Forks': e.forks_count,
          'Size': e.size,
          'Open issues': e.open_issues_count,
        }}
      />
    );

  }
  return (
    <>
      {
        items.length > 0 ?
          <>
            {
              items.map(
                (e) => (DisplayedCard(e))
              )
            }
            {
              shouldShow && !isLoading ? <Loading loader={loader} /> : null
            }

          </> : ( !isLoading &&  <p> Nothing to see here '| </p>)
      }
      {isLoading && <p style={{color: 'red', fontSize:30}}> Loading...</p>}
    </>

  )
}
export default memo(ItemsList);