import './Categories.css';
import React, { useState } from 'react';
import CheckboxOption from './components/CheckboxOption';
import RadioOption from './components/RadioOption';
import { Button } from '@material-ui/core';

export default function Categories(props) {

    const [reviewInfo, setReviewInfo] = useState("")

    const create_categories = () => {
        var array = []
        for (let i = 0; i < props.props.length; i++) {
            const element = props.props[i];
            if (element.type === "radio") {
                array.push(<RadioOption props={element} />)
            } else if (element.type === "check") {
                array.push(<CheckboxOption props={element} />)
            }
        }
        return array
    }
    const categoryComponents = create_categories()

    const generate_review = () => {
        var localReviewString = ""

        function appendCategoryTitle(title) {
            localReviewString += "---{ " + title + " }---\n"
        }

        function appendOption(option, checked) {
            localReviewString += (checked ? "☑ " : "☐ ") + option + "\n"
        }

        for (let i = 0; i < props.props.length; i++) {
            const categoryJson = props.props[i];

            appendCategoryTitle(categoryJson.title)

            // With radio, only one option is selected
            if (categoryJson.type === "radio") {
                const saved = sessionStorage.getItem(categoryJson.title) || ""
                categoryJson.options.forEach(option => {
                    appendOption(option, saved === option)
                });
            } else if (categoryJson.type === "check") {
                // With checkbox, multiple options can be selected
                const selectedOptions = JSON.parse(sessionStorage.getItem(categoryJson.title) || "[]")
                categoryJson.options.forEach(option => {
                    appendOption(option, selectedOptions.includes(option))
                });
            } else {
                localReviewString += "ERROR - 잘못된 카테고리 유형입니다. (radio | check)\n"
            }

            // newline under every category
            localReviewString += "\n"
        }

        // Credit 
        localReviewString += "\nGrab this review template here! 👉 https://vojtastruhar.github.io/steam-review-template/\n"

        navigator.clipboard.writeText(localReviewString).then(function () {
            console.log('Async: 클립보드에 성공적으로 복사했어요!');
            setReviewInfo("📋 리뷰 복사 완료!")
        }, function (err) {
            console.error('Async: 복사실패: ', err);
            setReviewInfo("클립보드에 복사하지 못했어요. 리뷰가 적힌 새 창이 나타나면 직접 복사해주세요.")
            check_review_in_new_window(localReviewString)
        });
    }

    const check_review_in_new_window = (text) => {
        var newWin = window.open('url', 'Steam review', 'height=700,width=500,scrollbars=yes,resizable=yes');
        newWin.document.write(String.raw`${text.replaceAll("\n", "<br/>")}`);
    }

    return (
        <div>
            <div className="centered">
                <div>
                    {categoryComponents}
                </div>
            </div>
            <div className="button-centered">
                <Button variant="contained" color="primary" onClick={generate_review}>
                    스팀 리뷰 생성하기!
                </Button>
                {reviewInfo !== "" &&
                    <p className="review" >{reviewInfo}</p>
                }
            </div>
        </div>
    )
}

