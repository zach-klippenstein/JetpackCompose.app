import { ComponentPreviewCard } from "./ComponentPreviewCard";
import ComponentsSearchBar from "./ComponentsSearchBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import NavigationBar from "../core/NavigationBar";
import PageTitle from "../core/PageTitle";
import { RouteComponentProps } from "@reach/router";
import React, { useState, useEffect } from "react";

export interface ComponentPreviewCardsSectionProps extends RouteComponentProps {
  pageContext: {
    componentsArray: [
      {
        id: string;
        title: string;
        description: string;
        contributorName: string;
        url: string;
        imageUrl: string;
        categories: string[];
      }
    ];
    githubMap: any;
  };
}

export default function ComponentPreviewCardsSection(
  props: ComponentPreviewCardsSectionProps
) {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState<string[]>([]);
  const allComponentCategories = props.pageContext.componentsArray.flatMap(
    (element) => {
      return element.categories;
    }
  );
  const uniqueComponentCategories = Array.from(new Set(allComponentCategories));
  const githubMap = new Map<string, any>(
    Object.entries(props.pageContext.githubMap)
  );
  const sortedComponentsArray = props.pageContext.componentsArray.sort(
    (first: any, second: any) => {
      const firstGihubStars = githubMap.has(first.url)
        ? githubMap.get(first.url).stargazers.totalCount
        : 0;
      const secondGihubStars = githubMap.has(second.url)
        ? githubMap.get(second.url).stargazers.totalCount
        : 0;
      return firstGihubStars > secondGihubStars ? -1 : 1;
    }
  );
  console.log(sortedComponentsArray);

  return (
    <>
      <Helmet>
        <title>
          Compose Catalog: Find the most popular Jetpack Compose libraries,
          tools and examples
        </title>
        <meta
          name="description"
          content="Compose Catalog: Discover the most popular Jetpack Compose libraries, tools and examples!"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://jetpackcompose.app/compose-catalog"
        />
        <meta
          property="twitter:title"
          content="Compose Catalog: Discover the most popular Jetpack Compose libraries, tools and examples!"
        />
        <meta
          property="twitter:description"
          content="Compose Catalog: Discover the most popular Jetpack Compose libraries, tools and examples!"
        />
        <meta
          property="twitter:image"
          content="https://jetpackcompose.app/faq_poster.png"
        />
      </Helmet>
      <main>
        <NavigationBar />
        <div className={classes.root}>
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              <Grid container justify="center" spacing={2}>
                <Grid key={"pageTitle"} item xs={12} md={6}>
                  <PageTitle
                    header="Jetpack Compose Catalog"
                    subheader="Discover the most popular Jetpack Compose libraries, tools and examples!"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} lg={12} className={classes.searchBar}>
                <ComponentsSearchBar
                  onChangeHandler={setSearchQuery}
                  componentCategories={uniqueComponentCategories.sort()}
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <Grid container spacing={4}>
                  {sortedComponentsArray
                    .filter((element, index, array) =>
                      meetsSearchCriteria(element, index, array, searchQuery)
                    )
                    .map((metadata) => (
                      <Grid
                        key={metadata.id}
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        alignContent="center"
                      >
                        <ComponentPreviewCard
                          title={metadata.title}
                          contributor={metadata.contributorName}
                          imageUrl={metadata.imageUrl}
                          resourceLink={metadata.url}
                          description={metadata.description}
                          categories={metadata.categories}
                          githubStars={
                            githubMap.get(metadata.url)
                              ? githubMap.get(metadata.url).stargazers
                                  .totalCount
                              : null
                          }
                        />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>
      </main>
    </>
  );
}

function meetsSearchCriteria(
  element: any,
  index: number,
  array: any[],
  searchQuery: string[]
): boolean {
  return (
    searchQuery.length === 0 ||
    element.categories.filter((value: string) => searchQuery.includes(value))
      .length > 0
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  grid: {},
  title: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  searchBar: {},
});
