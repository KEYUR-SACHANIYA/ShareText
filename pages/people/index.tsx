import Header from "@/components/common/Header";
import PeopleFeed from "@/components/people/PeopleFeed";

const People = () => {
  return ( 
    <>
      <Header showBackArrow label="People" />
      <PeopleFeed />
    </>
   );
}
 
export default People;